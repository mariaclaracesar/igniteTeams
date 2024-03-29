import { useState, useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { groupsGetAll } from '@storage/group/groupsGetAll';

import GroupCard from '@components/GroupCard';
import Header from '@components/Header';
import Highlight from '@components/Highlight';
import ListEmpty from '@components/ListEmpty';
import Button from '@components/Button';
import Loading from '@components/Loading';

import * as S from './styles';

export default function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation()

  function handleNewGroup(){
    navigation.navigate('new')
  }

  async function fetchGroups(){
    try{
      setIsLoading(true);

     const data = await groupsGetAll();

      setGroups(data);

    }catch(error){
      console.log(error);
      Alert.alert('Turmas', 'Náo foi possivel carregar as turmas')
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate('players', {group})
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  },[]));

  return (
    <S.Container>
      <Header />
      <Highlight 
        title="Turmas"
        subtitle="jogue com sua turma"
      />

    {
      isLoading ? <Loading /> :
        <FlatList 
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <GroupCard 
              title={item} 
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar a primeira turma?" />
          )}
          showsVerticalScrollIndicator={false}
        />
    }

      <Button 
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </S.Container>
  );
}