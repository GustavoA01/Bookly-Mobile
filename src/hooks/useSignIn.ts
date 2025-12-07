import { LoginFormType, loginSchema } from "@/data/schemas"
import { ModalMessageTypes } from "@/data/types"
import { auth } from "@/services/firebase/firebaseConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const useSignIn = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [modalMessages, setModalMessages] = useState<ModalMessageTypes | null>(
    null
  )
  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  })
  const { handleSubmit } = methods

  const onSubmit = async (data: LoginFormType) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.replace("/(tabs)/main")
    } catch (error) {
      setModalMessages({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        actionText: "Ok",
      })
      console.log((error as Error).message)
    }
  }
  
  return {
    methods,
    handleSubmit,
    onSubmit,
    modalMessages,
    setModalMessages,
    secureTextEntry,
    setSecureTextEntry,
  }
}