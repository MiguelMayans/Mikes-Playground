import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native"
import React from "react"
import { useState } from "react"
import { images } from "@/constants"
import FormField from "@/components/FormField"
import CustomButton from "@/components/CustomButton"
import { Link, router } from "expo-router"
import { signIn } from "@/lib/appwrite"
import { useGlobalContext } from "@/context/GlobalProvider"
import { getCurrentUser } from "@/lib/appwrite"

const SignIn = () => {
  const [form, setform] = useState({
    email: "",
    password: "",
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const { setUser, setIsLogged } = useGlobalContext()

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Please fill all fields")
      return
    }
    setisSubmitting(true)

    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser()
      setUser(result)
      setIsLogged(true)

      Alert.alert("Welcome back!")
      router.replace("/home")
    } catch (error) {
      router.replace("/home")
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          ></Image>
          <Text className="text-2xl text-white font-semibold font-psemibold text-center mt-8">
            Log In to Aora
          </Text>
          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e })}
            otherStyles="mt-6"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e })}
            otherStyles="mt-6"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="w-[370px] mt-12"
          />
          <Text className="text-white font-pregular mt-4">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-secondary-200 font-psemibold">
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
