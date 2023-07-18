import { useState } from 'react';
import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import { groupCreate } from '@storage/group/groupCreate';
import { AppError } from '@utils/AppError';

import Header from '@components/Header';
import Highlight from '@components/Highlight';
import Button from '@components/Button';
import Input from '@components/Input';
import { Alert } from 'react-native';



export default function NewGroup() {
	const [group, setGroup] = useState('')

	const navigation = useNavigation();

	async function handleNew(){
		try{
			if(group.trim().length === 0) {
				return Alert.alert('Novo grupo', 'Informe o nome da turma')
			}

			await groupCreate(group);
			navigation.navigate('players', { group });
		
		}catch(error){
			if(error instanceof AppError){
				Alert.alert('Novo grupo', error.message)
			}else{
				Alert.alert('Novo grupo', 'Nao foi possivel criar um novo grupo');
				console.log(error)
			}
		}
	}

  return (
    <S.Container>
			<Header showBackButton />

			<S.Content>
				<S.Icon />

				<Highlight 
					title='Nova turma'
					subtitle='Crie a turma para adicionar novas pessoas'
				/>

				<Input 
					placeholder='Nome da turma'
					onChangeText={setGroup}
				/>

				<Button 
					title='Criar'
					style={{ marginTop: 20}}
					onPress={handleNew}
				/>

			</S.Content>
    </S.Container>
  );
}
