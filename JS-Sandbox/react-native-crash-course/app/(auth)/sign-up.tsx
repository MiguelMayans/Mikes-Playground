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
import { createUser } from "../../lib/appwrite"

const SignUp = () => {
  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Please fill all fields")
      return
    }
    setisSubmitting(true)

    try {
      const result = await createUser(form.email, form.password, form.username)

      router.replace("/home")
    } catch (error) {
      console.log(error)
      Alert.alert("An error occured")
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
            Sign Up to Aora
          </Text>
          <FormField
            title="Username"
            placeholder="Enter your email"
            value={form.username}
            handleChangeText={(e) => setform({ ...form, username: e })}
            otherStyles="mt-6"
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-[370px] mt-12"
            isLoading={isSubmitting}
          />
          <Text className="text-white font-pregular mt-4">
            Have and account already?{" "}
            <Link href="/sign-in" className="text-secondary-200 font-psemibold">
              Sign In
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
