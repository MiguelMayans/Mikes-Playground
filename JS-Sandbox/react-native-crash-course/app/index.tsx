import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native"
import React from "react"
import { StatusBar } from "expo-status-bar"
import { Redirect, router, Router } from "expo-router"
import { useGlobalContext } from "@/context/GlobalProvider"
import { images } from "../constants"
import CustomButton from "@/components/CustomButton"

const RootLayout = () => {
  const { isLoading, isLoggedIn } = useGlobalContext()
  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center justify-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilites with
              <Text className="text-secondary-200"> Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[80px] h-[15px] absolute -bottom-2 left-44"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-gray-100 font-pregular mt-7 text-center p-4">
            Where cREACTivity meets innovation: embark on a journey of limitless
            innovation
          </Text>
          <CustomButton
            title="Continue with email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}

export default RootLayout
