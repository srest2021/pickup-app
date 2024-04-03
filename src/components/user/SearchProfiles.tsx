
import { YStack, ScrollView, Spinner, Button } from "tamagui";
import { View } from "react-native";
import { Text } from "tamagui";
import { useEffect, useState } from "react";
import { Input, Form, } from "tamagui";
import { UserSearch } from '@tamagui/lucide-icons'
import useQueryUsers from "../../hooks/use-query-users";
import { ThumbnailUser } from "../../lib/types";
import OtherUserThumbnail from "./OtherUserThumbnail";

const SearchProfiles = ({ navigation }: { navigation: any }) => {

    const { searchByUsername } = useQueryUsers();
    const [status, setStatus] = useState<string>('off');
    const [currentInput, setCurrentInput] = useState<string>('');
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        if (status === 'submitting') {
          const data = searchByUsername(currentInput);
          if (data !== null){
            console.log("got an object");
            console.log(data);
          }
          //setResults(searchByUsername(currentInput));
          const timer = setTimeout(() => setStatus('off'), 2000)
          return () => {
            clearTimeout(timer)
          }
        }
      }, [status])

  return (
    <View style={{ flex: 1, paddingHorizontal:15, paddingVertical:5}}>
        <Form flexDirection="row"  onSubmit={()=>{
            setStatus('submitting')
        }}>
        <Input marginRight={15} paddingRight={10} flex={1} borderWidth={2} placeholder="Search username" onChangeText={(text:string)=>setCurrentInput(text)}/>
        <Form.Trigger asChild>
            <Button backgroundColor="#e54b07" icon={status === 'submitting' ? () => <Spinner /> : UserSearch}></Button>
        </Form.Trigger>
        </Form>
    <ScrollView contentContainerStyle={{ paddingTop: 20 }} >
        <YStack>
          {results ? results.map((result: ThumbnailUser) => (
            <OtherUserThumbnail navigation={navigation} otherUserEntered={result}/>
          )): (<Text>No Search Yet</Text>)}
        </YStack>
    </ScrollView>
    </View>
  );
};

export default SearchProfiles;






