import { View, Text, TouchableOpacity } from "react-native"
import React from "react"

interface CustomButtonProps {
  title: string
  handlePress: () => void
  containerStyles?: string
  textStyles?: string
  isLoading?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        className={`bg-secondary w-[300px] rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <Text
          className={`text-white font-psemibold
     text-lg ${textStyles}`}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton
