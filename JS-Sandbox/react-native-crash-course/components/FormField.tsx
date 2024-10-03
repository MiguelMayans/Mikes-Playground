import { View, Text, TextInput, TouchableOpacity, Image } from "react-native"
import React, { useState } from "react"

import { icons } from "@/constants"

interface FormFieldProps {
  title: string
  value: string
  placeholder: string
  keyboardType?: string
  handleChangeText: (e: string) => void
  otherStyles?: string
}

const FormField = ({
  title,
  value,
  placeholder,
  keyboardType,
  handleChangeText,
  otherStyles,
  ...props
}: FormFieldProps) => {
  const [showPassword, setshowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-lg focus:border-2 focus:border-secondary items-center flex-row">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          value={value}
          onChangeText={handleChangeText}
          className="flex-1 text-white font-pmedium w-full text-center "
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
