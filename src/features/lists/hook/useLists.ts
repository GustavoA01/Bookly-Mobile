import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddListFormType, addListSchema } from "@/data/schemas"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createList, deleteList, getListById, getLists, updateList } from "@/services/firebase/lists"
import { ListType, ModalMessageTypes } from "@/data/types"
import { queryKeys } from "@/services/queryClientKeys/queryKeys"
import { Alert } from "react-native"

type UpdateListParams = { id: string, list: Partial<ListType> }

export const useLists = () => {
  const queryClient = useQueryClient()
  const methods = useForm<AddListFormType>({
    resolver: zodResolver(addListSchema),
  })

  const editListBottomSheetRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [listTitle, setListTitle] = useState<string>("")
  const [listId, setListId] = useState<string>("")
  const [modalMessages, setModalMessages] = useState<ModalMessageTypes | null>(null)

  const onDeleteList = () => {
    onCloseBottomSheet()
    setModalMessages({
      title: "",
      description: "Deseja realmente deletar esta lista?",
      actionText: "Ok",
      onConfirm: confirmDeleteList
    })
  }

  const onOpenAddListModal = async (id?: string) => {
    if (id !== undefined) {
      setIsEditing(true)
      const list = await getListById(id)

      methods.reset({
        title: list.title ?? "",
        listDescription: list.description ?? "",
      })
    }
    setVisible(true)
    editListBottomSheetRef.current?.close()
  }

  const onCloseAddListModal = () => {
    methods.reset({
      title: "",
      listDescription: "",
    })
    setVisible(false)
    setIsEditing(false)
  }

  const onOpenBottomSheet = (item: { title: string; id: string }) => {
    editListBottomSheetRef.current?.open()
    setListTitle(item.title)
    setListId(item.id)
  }

  const onCloseBottomSheet = () => {
    editListBottomSheetRef.current?.close()
  }

  const formatDescription = (booksLength: number) => {
    if (booksLength > 0) return `${booksLength} livro${booksLength > 1 ? "s" : ""}`
    return "Nenhum livro adicionado"
  }

  const { data: lists, isLoading: isLoadingLists } = useQuery({
    queryKey: [queryKeys.lists],
    queryFn: getLists,
  })

  const { mutateAsync: createListFn, isPending: isCreatingListLoading } = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.lists] })
      onCloseAddListModal()
      setModalMessages({
        title: "", description: "Lista criada com sucesso", actionText: "Ok"
      })
      methods.reset({
        title: "",
        listDescription: "",
      })
    },
    onError: () => {
      setModalMessages({ title: "Erro", description: "Erro ao adicionar lista", actionText: "Ok" })
    }
  })

  const onCreateList = async (data: AddListFormType) => {
    try {
      await createListFn({ title: data.title, description: data.listDescription })
    } catch (error) {
      console.log(error)
    }
  }

  const { mutateAsync: updateListFn } = useMutation({
    mutationFn: (updateListParams: UpdateListParams) => updateList(updateListParams.id, updateListParams.list),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: [queryKeys.lists] })
      onCloseAddListModal()
      Alert.alert("Lista atualizada com sucesso")
    },
    onError: () => {
      Alert.alert("Erro ao atualizar lista")
    }
  })

  const onUpdateList = async (data: AddListFormType) => {
    try {
      await updateListFn({
        id: listId,
        list: { title: data.title, description: data.listDescription }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const { mutateAsync: deleteListFn } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.lists] })
      Alert.alert("Lista deletada com sucesso")
    },
    onError: () => {
      Alert.alert("Erro ao deletar lista")
    }
  })

  const confirmDeleteList = () => {
    deleteListFn(listId)
  }

  return {
    lists,
    isLoadingLists,
    isCreatingListLoading,
    editListBottomSheetRef,
    visible,
    onOpenAddListModal,
    onCloseAddListModal,
    listTitle,
    listId,
    onOpenBottomSheet,
    onCloseBottomSheet,
    formatDescription,
    methods,
    onCreateList,
    onUpdateList,
    isEditing,
    updateListFn,
    onDeleteList,
    confirmDeleteList,
    modalMessages,
    setModalMessages,
  }
}