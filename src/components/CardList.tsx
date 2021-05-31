import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onClose, isOpen, onOpen } = useDisclosure();

  const [imageUrl, setImageUrl] = useState('');

  const handleViewImage = (url: string): void => {
    setImageUrl(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(data => (
          <Card data={data} viewImage={handleViewImage} key={data.id} />
        ))}
      </SimpleGrid>
      <ModalViewImage imgUrl={imageUrl} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
