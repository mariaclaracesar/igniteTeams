import { Alert, FlatList, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemovebyGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

import ButtonIcon from '@components/ButtonIcon';
import Filter from '@components/Filter';
import Header from '@components/Header';
import Highlight from '@components/Highlight';
import Input from '@components/Input';
import PlayerCard from '@components/PlayerCard';
import ListEmpty from '@components/ListEmpty';
import Button from '@components/Button';
import { AppError } from '@utils/AppError';

import * as S from './styles';
import Loading from '@components/Loading';


type RouteParams = {
  group: string;
}

export default function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar');
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('')
      fetchPlayersByTeam();

    }catch (error) {
      if(error instanceof AppError){
        Alert.alert('Nova pessoa', error.message)
      }else{
        console.log(error)
        Alert.alert('Nova pessoa', 'Náo foi possivel adicionar')
      }
    }
  }

  async function fetchPlayersByTeam(){
    try{
      setIsLoading(true)

      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      setPlayers(playersByTeam);

    }catch(error){
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas do time selecionado')
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string){
    try{
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam();

    } catch(error){
      console.log(error)
      Alert.alert('Remover pessoa', 'Náo foi possivel remover essa pessoa.');
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group);

      navigation.navigate('groups');
    } catch (error) {
      console.log(error)
      Alert.alert('Remover grupo', 'Nao foi possivel remover o grupo')
    }
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Deseja remover a turma?',
      [
        { text: 'Nao', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    );
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <S.Container >
        <Header showBackButton />

        <Highlight 
            title={group}
            subtitle='adicione a galera e separe os times'
        />

        <S.Form>
          <Input 
            inputRef={newPlayerNameInputRef}
            onChangeText={setNewPlayerName}
            value={newPlayerName}
            placeholder='Nome da pessoa'
            autoCorrect={false}
            onSubmitEditing={handleAddPlayer}
            returnKeyLabel="done"
          />

          <ButtonIcon 
            icon='add' 
            onPress={handleAddPlayer}
          />
        </S.Form>


        <S.HeaderList>
          <FlatList 
            data={['Time A', 'Time B']}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
          />
            )}
            horizontal
          />

          <S.NumbersOffPlayers>
            {players.length}
          </S.NumbersOffPlayers>

        </S.HeaderList>

      {
        isLoading ? <Loading /> :
          <FlatList 
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty 
                message="Não ha pessoas nessa time." 
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[ { paddingBottom: 100 },players.length === 0 && { flex: 1 } ]}
          />
      }

        <Button 
          title='Remover turma'
          type='SECONDARY'
          onPress={handleGroupRemove}
        />
    </S.Container>
  );
}
