<script setup lang="ts">
import { MapPin, X } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface PinInfo {
  title: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface Props {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  apiKey?: string;
  pinInfo?: PinInfo;
}

const props = withDefaults(defineProps<Props>(), {
  address: "123 Real Estate St, City, State 12345",
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 15,
  pinInfo: () => ({
    title: "Our Location",
    description: "Visit us at our office",
    address: "123 Real Estate St, City, State 12345",
  }),
});

const config = useRuntimeConfig();
const mapError = ref<string | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);
const showPinInfo = ref(false);
const mapLoaded = ref(false);
const isMounted = ref(false);
let mapInstance: any = null;
let markerInstance: any = null;
let infoWindowInstance: any = null;
let scriptElement: HTMLScriptElement | null = null;

const googleMapsApiKey = computed(() => {
  return props.apiKey || config.public.googleMapsApiKey || "";
});

const togglePinInfo = () => {
  showPinInfo.value = !showPinInfo.value;
  if (infoWindowInstance && mapInstance && markerInstance) {
    if (showPinInfo.value) {
      infoWindowInstance.open(mapInstance, markerInstance);
    } else {
      infoWindowInstance.close();
    }
  }
};

const createCustomPinSVG = () => {
  // Create a custom pin SVG with theme colors
  const svg = `
    <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#222222"/>
      <circle cx="20" cy="20" r="8" fill="#ffffff"/>
      <circle cx="20" cy="20" r="5" fill="#222222"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createInfoWindowContent = () => {
  const pinInfo = props.pinInfo || {
    title: "Our Location",
    description: "Visit us at our office",
    address: props.address || "123 Real Estate St, City, State 12345",
  };

  return `
    <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #222222;">
        ${pinInfo.title}
      </h3>
      ${
        pinInfo.description
          ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">${pinInfo.description}</p>`
          : ""
      }
      ${
        pinInfo.address
          ? `<p style="margin: 0 0 4px 0; font-size: 13px; color: #666666;">📍 ${pinInfo.address}</p>`
          : ""
      }
      ${
        pinInfo.phone
          ? `<p style="margin: 0 0 4px 0; font-size: 13px; color: #666666;">📞 ${pinInfo.phone}</p>`
          : ""
      }
      ${
        pinInfo.email
          ? `<p style="margin: 0; font-size: 13px; color: #666666;">✉️ ${pinInfo.email}</p>`
          : ""
      }
    </div>
  `;
};

const initMap = async () => {
  if (!isMounted.value || !mapContainer.value || !googleMapsApiKey.value) {
    if (!googleMapsApiKey.value) {
      mapError.value =
        "Google Maps API key is not configured. Please set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.";
    }
    return;
  }

  try {
    // Load Google Maps JavaScript API
    if (!window.google || !window.google.maps || !window.google.maps.Map) {
      // Remove existing script if any
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }

      scriptElement = document.createElement("script");
      scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey.value}&libraries=places`;
      scriptElement.async = true;
      scriptElement.defer = true;

      scriptElement.onload = () => {
        // Wait for Google Maps API to be fully initialized
        const waitForGoogleMaps = () => {
          if (window.google?.maps?.Map) {
            // Check if component is still mounted before creating map
            if (isMounted.value && mapContainer.value) {
              nextTick(() => {
                createMap();
              });
            }
          } else {
            // Retry after a short delay if API is not ready yet
            setTimeout(waitForGoogleMaps, 50);
          }
        };
        waitForGoogleMaps();
      };

      scriptElement.onerror = () => {
        if (isMounted.value) {
          mapError.value =
            "Failed to load Google Maps JavaScript API. Please check your API key and ensure the Maps JavaScript API is enabled in your Google Cloud Console.";
        }
      };

      document.head.appendChild(scriptElement);
    } else {
      // Google Maps already loaded, create map on next tick
      nextTick(() => {
        createMap();
      });
    }
  } catch (error) {
    console.error("Error initializing map:", error);
    if (isMounted.value) {
      mapError.value = "Failed to initialize Google Maps.";
    }
  }
};

const createMap = () => {
  try {
    // Ensure component is still mounted and DOM is ready
    if (!isMounted.value || !mapContainer.value || !window.google?.maps?.Map) {
      return;
    }

    // Double-check that the container is still in the DOM
    if (!mapContainer.value.parentNode) {
      return;
    }

    const position = {
      lat: props.latitude || 40.7128,
      lng: props.longitude || -74.006,
    };

    // Create map
    mapInstance = new window.google.maps.Map(mapContainer.value, {
      center: position,
      zoom: props.zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Create custom marker icon (SVG as data URL)
    const customPinIcon = {
      url: createCustomPinSVG(),
      scaledSize: new window.google.maps.Size(40, 50),
      anchor: new window.google.maps.Point(20, 50),
    };

    // Create marker
    markerInstance = new window.google.maps.Marker({
      position: position,
      map: mapInstance,
      icon: customPinIcon,
      title: props.pinInfo?.title || "Location",
      animation: window.google.maps.Animation.DROP,
      clickable: true,
    });

    // Create info window content
    const infoContent = createInfoWindowContent();

    // Create info window
    infoWindowInstance = new window.google.maps.InfoWindow({
      content: infoContent,
    });

    // Add click event to marker
    markerInstance.addListener("click", () => {
      if (isMounted.value && infoWindowInstance && mapInstance && markerInstance) {
        infoWindowInstance.open(mapInstance, markerInstance);
        showPinInfo.value = true;
      }
    });

    // Add click event to map to close info window
    mapInstance.addListener("click", () => {
      if (isMounted.value && infoWindowInstance) {
        infoWindowInstance.close();
      }
      if (isMounted.value) {
        showPinInfo.value = false;
      }
    });

    // Set mapLoaded on next tick to avoid DOM insertion errors during hydration
    // Use requestAnimationFrame to ensure DOM is fully ready
    requestAnimationFrame(() => {
      nextTick(() => {
        if (isMounted.value && mapContainer.value && mapContainer.value.parentNode) {
          try {
            mapLoaded.value = true;
          } catch (error) {
            console.error("Error setting mapLoaded:", error);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error creating map:", error);
    if (isMounted.value) {
      mapError.value = "Failed to create Google Map. Please try refreshing the page.";
    }
  }
};

onMounted(() => {
  isMounted.value = true;
  nextTick(() => {
    if (googleMapsApiKey.value && mapContainer.value) {
      initMap();
    }
  });
});

onUnmounted(() => {
  isMounted.value = false;
  
  if (infoWindowInstance) {
    infoWindowInstance.close();
    infoWindowInstance = null;
  }
  if (markerInstance) {
    markerInstance.setMap(null);
    markerInstance = null;
  }
  if (mapInstance) {
    mapInstance = null;
  }
  
  // Clean up script element if it exists
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement);
    scriptElement = null;
  }
});

watch(
  () => props.latitude,
  () => {
    if (mapInstance && markerInstance && props.latitude && props.longitude) {
      const newPosition = {
        lat: props.latitude,
        lng: props.longitude,
      };
      markerInstance.setPosition(newPosition);
      mapInstance.setCenter(newPosition);
    }
  }
);

watch(
  () => props.longitude,
  () => {
    if (mapInstance && markerInstance && props.latitude && props.longitude) {
      const newPosition = {
        lat: props.latitude,
        lng: props.longitude,
      };
      markerInstance.setPosition(newPosition);
      mapInstance.setCenter(newPosition);
    }
  }
);
</script>

<template>
  <section class="w-full py-16 px-4 bg-background">
    <div class="max-w-7xl mx-auto">
      <div class="rounded-lg overflow-hidden shadow-lg relative">
        <!-- Google Maps Container -->
        <div ref="mapContainer" class="relative w-full h-[500px] bg-muted">
          <!-- Error Message -->
          <div
            v-if="mapError"
            class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-muted z-10"
          >
            <div class="max-w-md space-y-4">
              <p class="text-lg font-semibold text-foreground">
                Google Maps Error
              </p>
              <p class="text-sm text-muted-foreground">
                {{ mapError }}
              </p>
              <div
                class="mt-4 p-4 bg-background rounded-lg border border-border text-left"
              >
                <p class="text-xs font-semibold text-foreground mb-2">
                  To fix this issue:
                </p>
                <ol
                  class="text-xs text-muted-foreground space-y-1 list-decimal list-inside"
                >
                  <li>
                    Go to
                    <a
                      href="https://console.cloud.google.com/apis/library"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline"
                      >Google Cloud Console</a
                    >
                  </li>
                  <li>Select your project (or create a new one)</li>
                  <li>
                    Enable the <strong>"Maps JavaScript API"</strong> for your
                    project
                  </li>
                  <li>
                    Go to
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline"
                      >API Credentials</a
                    >
                    and ensure your API key has the correct restrictions (or no
                    restrictions for testing)
                  </li>
                  <li>
                    Set
                    <code class="bg-muted px-1 py-0.5 rounded text-xs"
                      >NUXT_PUBLIC_GOOGLE_MAPS_API_KEY</code
                    >
                    in your
                    <code class="bg-muted px-1 py-0.5 rounded text-xs"
                      >.env</code
                    >
                    file
                  </li>
                  <li>Restart your development server</li>
                </ol>
                <p class="text-xs text-muted-foreground mt-3">
                  <strong>Note:</strong> The error "API project is not
                  authorized to use this API" means the Maps JavaScript API is
                  not enabled for your project.
                </p>
              </div>
            </div>
          </div>

          <!-- Custom Pin Info Card (overlay) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <Card
              v-if="showPinInfo && pinInfo"
              class="absolute top-4 left-4 z-20 max-w-sm shadow-xl"
            >
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2">
                    <MapPin class="h-5 w-5 text-primary" />
                    <CardTitle class="text-lg">{{ pinInfo.title }}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6"
                    @click="togglePinInfo"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent class="space-y-2">
                <p
                  v-if="pinInfo.description"
                  class="text-sm text-muted-foreground"
                >
                  {{ pinInfo.description }}
                </p>
                <div
                  v-if="pinInfo.address"
                  class="flex items-start gap-2 text-sm"
                >
                  <MapPin
                    class="h-4 w-4 text-muted-foreground mt-0.5 shrink-0"
                  />
                  <span class="text-muted-foreground">{{
                    pinInfo.address
                  }}</span>
                </div>
                <div
                  v-if="pinInfo.phone"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="text-muted-foreground">📞</span>
                  <a
                    :href="`tel:${pinInfo.phone}`"
                    class="text-primary hover:underline"
                  >
                    {{ pinInfo.phone }}
                  </a>
                </div>
                <div
                  v-if="pinInfo.email"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="text-muted-foreground">✉️</span>
                  <a
                    :href="`mailto:${pinInfo.email}`"
                    class="text-primary hover:underline"
                  >
                    {{ pinInfo.email }}
                  </a>
                </div>
              </CardContent>
            </Card>
          </Transition>

          <!-- Custom Pin Button (if map is loaded) -->
          <div
            v-if="mapLoaded && !showPinInfo && pinInfo"
            class="absolute top-4 left-4 z-20"
          >
            <Button
              @click="togglePinInfo"
              class="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              <MapPin class="h-4 w-4 mr-2" />
              Show Location Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
