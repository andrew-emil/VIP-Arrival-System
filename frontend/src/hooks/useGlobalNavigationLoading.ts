import { useNavigation } from "react-router";

export function useGlobalNavigationLoading() {
    const { state } = useNavigation();
    return state === "submitting" || state === "loading";
}