import { View } from "react-native"
import { List, Portal } from "react-native-paper"
import { AccordionDescription } from "../components/AccordionDescription"
import { CustomBottomSheet } from "../../../components/ui/CustomBottomSheet"
import { BookInfo } from "../components/BookInfo"
import { RightAccordion } from "../components/RightAccordion"
import { BookEditOptions } from "../components/BookEditOptions"
import { BookType } from "@/data/types"
import { useBookAccordion } from "../hook/useBookAccordion"
import { AddToListSheet } from "./AddToListSheet"
import { ConfirmModal } from "@/components/ConfirmModal"

export const BookAccordion = ({
  id,
  title,
  author,
  status,
  description,
  rating,
  category,
  addedIn,
  startDate,
  endDate,
}: Omit<BookType, "userId">) => {
  const {
    onOpenBottomSheet,
    isListPathName,
    visible,
    hideModal,
    handleEdit,
    handleAddToList,
    onDelete,
    handelDeleteBook,
    handleRemoveFromList,
    bottomSheetRef,
    listBottomSheet,
    modalMessages,
  } = useBookAccordion()



  return (
    <View>
      <List.Accordion
        id={id}
        title={title}
        titleNumberOfLines={1}
        description={
          <AccordionDescription author={author ?? "-"} status={status} />
        }
        descriptionNumberOfLines={1}
        onLongPress={onOpenBottomSheet}
        delayLongPress={200}
        right={() => (rating ? <RightAccordion rating={rating} /> : null)}
      >
        <BookInfo
          addedIn={addedIn}
          startDate={startDate}
          endDate={endDate}
          category={category}
          description={description}
        />
      </List.Accordion>

      <CustomBottomSheet
        height={isListPathName ? 350 : 300}
        bottomSheetRef={bottomSheetRef}
      >
        <BookEditOptions
          bookTitle={title}
          onEdit={() => handleEdit(id)}
          onAddToList={handleAddToList}
          onRemoveFromList={
            isListPathName ? () => handleRemoveFromList(id) : undefined
          }
          onDelete={onDelete}
        />
      </CustomBottomSheet>

      <Portal>
        <ConfirmModal
          title={modalMessages?.title ?? ""}
          description={
            modalMessages?.description ??
            "Deseja realmente deletar este livro? Ele também será excluído de qualquer lista que esteja presente."
          }
          onConfirm={() => handelDeleteBook(id)}
          visible={visible}
          hideModal={hideModal}
          confirmButtonText={modalMessages?.actionText ?? "Ok"}
          cancelButton={true}
        />
      </Portal>

      <CustomBottomSheet height={350} bottomSheetRef={listBottomSheet}>
        <AddToListSheet bookId={id} />
      </CustomBottomSheet>
    </View>
  )
}
