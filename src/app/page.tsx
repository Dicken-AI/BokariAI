import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bokari - Votre Journaliste IA',
  description: 'Posez vos questions, Bokari recherche, verifie et vous informe.',
};

const Home = () => {
  return <ChatWindow />;
};

export default Home;
