import { useRef, useState } from "react"
import { usePathname } from "expo-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBook } from "@/services/firebase/books"
import { router } from "expo-router"
import { useLists } from "@/features/lists/hook/useLists"
import { queryKeys } from "@/services/queryClientKeys/queryKeys"
import { ModalMessageTypes } from "@/data/types"

export const useBookAccordion = () => {
  const queryClient = useQueryClient()
  const { lists, updateListFn } = useLists()
  const bottomSheetRef = useRef<any>(null)
  const listBottomSheet = useRef<any>(null)
  const onOpenBottomSheet = () => bottomSheetRef.current?.open()
  const pathname = usePathname()
  const isListPathName = pathname.includes("/list-details")
  const [modalMessages, setModalMessages] = useState<ModalMessageTypes | null>(null)

  const [visible, setVisible] = useState(false)

  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const { mutateAsync: deleteBookFn } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.globalBooks] })
      setTimeout(() => {
        setModalMessages({ title: "", description: "Livro deletado com sucesso", actionText: "Ok" })
      }, 500)
    },
    onError: () => {
      setModalMessages({ title: "Erro", description: "Erro ao deletar livro", actionText: "Ok" })
    }
  })

  const handleEdit = (id: string) => {
    bottomSheetRef.current?.close()
    router.push({
      pathname: "/book-form",
      params: {
        id,
        source: "firebase",
      }
    })
  }

  const handleAddToList = () => {
    bottomSheetRef.current?.close()
    listBottomSheet.current?.open()
  }

  const onDelete = () => {
    bottomSheetRef.current?.close()
    showModal()
  }

  const handelDeleteBook = (id: string) => {
    hideModal()
    deleteBookFn(id).then(() => {
      if (isListPathName) {
        handleRemoveFromList(id)
        queryClient.invalidateQueries({ queryKey: [queryKeys.lists] })
        queryClient.invalidateQueries({ queryKey: [queryKeys.listBooks] })
      }
    })
  }

  const handleRemoveFromList = (id: string) => {
    const list = lists?.find((list) => list.books.includes(id))
    if (list) {
      const newList = { ...list, books: list?.books.filter((book) => book !== id) }
      updateListFn({ id: list.id, list: newList })
      queryClient.invalidateQueries({ queryKey: [queryKeys.listBooks, list.id] })
      bottomSheetRef.current?.close()
    }
  }

  return {
    onOpenBottomSheet,
    isListPathName,
    visible,
    showModal,
    hideModal,
    deleteBookFn,
    handleEdit,
    handleAddToList,
    onDelete,
    handelDeleteBook,
    handleRemoveFromList,
    bottomSheetRef,
    listBottomSheet,
    modalMessages,
    setModalMessages,
  }
}