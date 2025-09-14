import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
    console.log(name, params);
    if (navigationRef.isReady()) {
        console.log("iii")
        navigationRef.navigate(name, params);
    }
}
