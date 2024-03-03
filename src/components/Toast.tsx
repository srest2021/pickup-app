import { Toast, useToastState } from "@tamagui/toast";
import { YStack } from "tamagui";

/**
 *  IMPORTANT NOTE:
 *    How to show toast in your component:
 *    - Import { ToastDemo } into your file and any other toast imports needed from tamagui (i.e. Toast Controller)
 *    - In the component you want to show your toast in, include:
 *      - <ToastViewport /> where you want to show the toasts
 *      - <ToastDemo />
 *
 *      Also create a toast controller instance:
 *      - const toast = useToastController();
 *      - Wherever you want to call the toast to show include a line like this (with the title and message you desire to show):
 *            toast.show("Successfully saved!", {
 *                        message: "Don't worry, we've got your data.",
 *                       });
 *
 */
export const ToastDemo = () => {
  return (
    <YStack alignItems="center">
      <CurrentToast />
    </YStack>
  );
};

const CurrentToast = () => {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={5000}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};
