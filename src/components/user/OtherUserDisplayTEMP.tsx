
import { YStack, ScrollView, H4, Spinner, Separator, Button } from "tamagui";
import { Alert, View } from "react-native";
import { Tabs, Text } from "tamagui";
import { useStore } from "../../lib/store"
import { useEffect, useState } from "react";
import { Input, Form, } from "tamagui";
import { UserSearch } from '@tamagui/lucide-icons'

const SearchProfiles = ({ navigation }: { navigation: any }) => {

    const [status, setStatus] = useState('off');
    const [currentinput, setCurrentInput] = useState('');

    useEffect(() => {
        if (status === 'submitting') {
          const timer = setTimeout(() => setStatus('off'), 2000)
          return () => {
            clearTimeout(timer)
          }
        }
      }, [status])

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 20 }} >
        <YStack>
        <Form onSubmit={()=>{
            setStatus('submitting')
        }}>
        <Input flex = {1} size={4} borderWidth={2} placeholder="Search username" onChangeText={(text:string)=>setCurrentInput(text)}/>
        </Form>
        <Form.Trigger asChild>
            <Button icon={status === 'submitting' ? () => <Spinner /> : UserSearch}></Button>
        </Form.Trigger>
        </YStack>
    </ScrollView>
  );
};

export default SearchProfiles;






