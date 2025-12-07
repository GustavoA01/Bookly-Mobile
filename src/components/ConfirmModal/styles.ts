import { theme } from "@/theme"
import { StyleSheet } from "react-native"
export const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 24,
  },

  title: {
    textAlign: "center",
    fontWeight: "bold",
  },

  description: {
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})