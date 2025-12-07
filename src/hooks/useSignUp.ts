import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpFormType, signUpSchema } from "@/data/schemas"
import { auth } from "@/services/firebase/firebaseConfig"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { router } from "expo-router"
import { ModalMessageTypes } from "@/data/types"

export const useSignUp = () => {
  const [modalMessages, setModalMessages] = useState<ModalMessageTypes | null>(null)
  const methods = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
  })
  const {
    formState: { errors },
  } = methods
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const onSubmit = async (data: SignUpFormType) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.userName
        })
        router.replace("/(tabs)/main")
      }
    } catch (error) {
      setModalMessages({
        title: "Erro ao cadastrar usuário",
        description: "Verifique os dados e tente novamente",
        actionText: "Ok"
      })
      console.log((error as Error).message)
    }
  }

  return {
    methods,
    errors,
    secureTextEntry,
    setSecureTextEntry,
    onSubmit,
    modalMessages,
    setModalMessages,
  }
}