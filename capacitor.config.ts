import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "studyapp_mk3",
  appName: "StudyApp",
  webDir: "www",
  bundledWebRuntime: false,

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#7895ac",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#d8e8f5",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;
