import { FormProvider } from "react-hook-form"
import { EmailPasswInputs } from "../components/EmailPasswInputs"
import { AuthFooter } from "../components/AuthFooter"
import { LoginFormType } from "@/data/schemas"
import { ConfirmModal } from "@/components/ConfirmModal"
import { Portal } from "react-native-paper"
import { useSignIn } from "@/hooks/useSignIn"

export const LoginForm = () => {
  const {
    methods,
    handleSubmit,
    onSubmit,
    modalMessages,
    setModalMessages,
    secureTextEntry,
    setSecureTextEntry,
  } = useSignIn()

  return (
    <>
      <FormProvider {...methods}>
        <EmailPasswInputs<LoginFormType>
          secureTextEntry={secureTextEntry}
          setSecureTextEntry={setSecureTextEntry}
        />
        <AuthFooter onSubmit={handleSubmit(onSubmit)} buttonText="Entrar" />
      </FormProvider>

      <Portal>
        <ConfirmModal
          visible={modalMessages !== null}
          hideModal={() => setModalMessages(null)}
          title={modalMessages?.title ?? ""}
          description={modalMessages?.description ?? ""}
          onConfirm={() => setModalMessages(null)}
          confirmButtonText="Ok"
          cancelButton
        />
      </Portal>
    </>
  )
}
