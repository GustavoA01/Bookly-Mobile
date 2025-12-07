import { Text } from "react-native-paper"
import SafeAreaWrapper from "../components/ui/SafeAreaWrapper"
import { View } from "react-native"
import { SignUpForm } from "@/features/auth/container/SignUpForm"
import { authStyles } from "@/features/auth/container/styles"

const SignUpScreen = () => {
  return (
    <SafeAreaWrapper>
      <View style={authStyles.container}>
        <Text variant="displayMedium" style={authStyles.title}>
          Bookly
        </Text>
        <SignUpForm />
      </View>
    </SafeAreaWrapper>
  )
}

export default SignUpScreen
