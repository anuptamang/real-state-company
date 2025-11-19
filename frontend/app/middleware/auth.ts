/**
 * Authentication middleware
 * Redirects unauthenticated users to login page
 */

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    // Redirect to login with the intended destination
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
