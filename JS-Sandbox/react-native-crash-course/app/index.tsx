import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { StatusBar } from "expo-status-bar"
import { Link } from "expo-router"

const RootLayout = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View>
        <Text className="text-3xl font-pblack">Aora!</Text>
      </View>
      <StatusBar style="auto" />
      <Link href="/profile" style={{ color: "blue", fontSize: 20 }}>
        Profile
      </Link>
    </View>
  )
}

export default RootLayout
