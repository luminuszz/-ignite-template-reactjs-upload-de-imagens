import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Flex,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#353431">
        <Image src={imgUrl} maxW={900} maxH={600} w="100%" h="100%" />

        <ModalFooter
          h="32px"
          py="10px"
          px="10px"
          bg="#353431"
          borderRadius="base"
          display="flex"
          justifyContent="flex-start"
        >
          <Link href={imgUrl} target="_blank" color="white" fontSize="14px">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
