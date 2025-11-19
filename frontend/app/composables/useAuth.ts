/**
 * Authentication composable for user login, signup, and session management
 */

export const useAuth = () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;
  const user = useState<User | null>("auth-user", () => null);
  const token = useState<string | null>("auth-token", () => null);

  // Initialize auth state from localStorage on client
  if (process.client) {
    const storedToken = localStorage.getItem("auth-token");
    const storedUser = localStorage.getItem("auth-user");
    
    if (storedToken) {
      token.value = storedToken;
    }
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        // Invalid stored user data
        localStorage.removeItem("auth-user");
      }
    }
  }

  /**
   * Register a new user
   */
  const signup = async (
    username: string,
    email: string,
    password: string,
    name?: string,
    address?: string
  ) => {
    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      const response = await $fetch<{ user: User; jwt: string }>(
        `${baseUrl}/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            username,
            email,
            password,
          },
        }
      );

      // Store token and user
      token.value = response.jwt;
      user.value = response.user;

      // Create user profile if name or address provided
      if ((name || address) && response.jwt) {
        try {
          await $fetch(`${baseUrl}/api/user-profiles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${response.jwt}`,
            },
            body: {
              data: {
                name: name?.trim() || undefined,
                address: address?.trim() || undefined,
              },
            },
          });
        } catch (profileError) {
          // Profile creation failed, but registration succeeded
          console.warn("Failed to create user profile:", profileError);
        }
      }

      // Persist to localStorage
      if (process.client) {
        localStorage.setItem("auth-token", response.jwt);
        localStorage.setItem("auth-user", JSON.stringify(response.user));
      }

      return { success: true, user: response.user };
    } catch (error: any) {
      const errorMessage =
        error?.data?.error?.message ||
        error?.message ||
        "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Login with email/username and password
   */
  const login = async (identifier: string, password: string) => {
    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      const response = await $fetch<{ user: User; jwt: string }>(
        `${baseUrl}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            identifier, // Can be email or username
            password,
          },
        }
      );

      // Store token and user
      token.value = response.jwt;
      user.value = response.user;

      // Persist to localStorage
      if (process.client) {
        localStorage.setItem("auth-token", response.jwt);
        localStorage.setItem("auth-user", JSON.stringify(response.user));
      }

      return { success: true, user: response.user };
    } catch (error: any) {
      const errorMessage =
        error?.data?.error?.message || error?.message || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout current user
   */
  const logout = () => {
    user.value = null;
    token.value = null;

    if (process.client) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
    }
  };

  /**
   * Get current user (from token if available)
   */
  const getCurrentUser = async () => {
    if (!token.value) {
      return null;
    }

    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      const response = await $fetch<User>(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      user.value = response;
      
      if (process.client) {
        localStorage.setItem("auth-user", JSON.stringify(response));
      }

      return response;
    } catch (error) {
      // Token is invalid, clear auth state
      logout();
      return null;
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => {
    return !!user.value && !!token.value;
  });

  /**
   * Get auth headers for API requests
   */
  const getAuthHeaders = () => {
    if (!token.value) {
      return {};
    }
    return {
      Authorization: `Bearer ${token.value}`,
    };
  };

  /**
   * Get user profile
   */
  const getUserProfile = async () => {
    if (!token.value) {
      return null;
    }

    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      const response = await $fetch<{ data: UserProfile[] }>(
        `${baseUrl}/api/user-profiles`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (name?: string, address?: string) => {
    if (!token.value) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      // First, try to get existing profile
      const existingProfile = await getUserProfile();

      const profileData: any = {};
      if (name !== undefined) profileData.name = name.trim() || null;
      if (address !== undefined) profileData.address = address.trim() || null;

      if (existingProfile) {
        // Update existing profile
        await $fetch(`${baseUrl}/api/user-profiles/${existingProfile.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: {
            data: profileData,
          },
        });
      } else {
        // Create new profile
        await $fetch(`${baseUrl}/api/user-profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: {
            data: profileData,
          },
        });
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.data?.error?.message ||
        error?.message ||
        "Failed to update profile";
      return { success: false, error: errorMessage };
    }
  };

  // Initialize user on mount if token exists
  if (process.client && token.value && !user.value) {
    getCurrentUser();
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    signup,
    login,
    logout,
    getCurrentUser,
    getAuthHeaders,
    getUserProfile,
    updateUserProfile,
  };
};
