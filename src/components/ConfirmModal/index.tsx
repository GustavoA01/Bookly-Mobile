import { Modal, Text, Button } from "react-native-paper"
import { theme } from "@/theme"
import { View } from "react-native"
import { styles } from "./styles"

type ConfirmModalProps = {
  visible: boolean
  hideModal: () => void
  title?: string
  description: string
  cancelButton?: boolean
  confirmButtonText?: string
  onConfirm: () => void
}

export const ConfirmModal = ({
  visible,
  hideModal,
  title,
  description,
  cancelButton,
  onConfirm,
  confirmButtonText,
}: ConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.modalContainer}
    >
      {title && (
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
      )}

      <Text variant="bodyMedium" style={styles.description}>
        {description}
      </Text>

      <View style={styles.buttonsContainer}>
        {cancelButton && (
          <Button textColor={theme.colors.onSurface} onPress={hideModal}>
            Cancelar
          </Button>
        )}
        
        <Button onPress={onConfirm} textColor={theme.colors.secondary}>
          {confirmButtonText}
        </Button>
      </View>
    </Modal>
  )
}
