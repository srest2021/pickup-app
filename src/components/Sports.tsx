import { View, Text } from "react-native";
import { Sport as SportType } from "../lib/types";
import Sport from "./Sport";
import useMutationUser from "../hooks/use-mutation-user";
import { useEffect } from "react";

export default function Sports({ sports }: { sports: any }) {

  console.log("sports");
  console.log(sports);
  return (
    <View>
      <Text className="text-lg font-bold" style={{paddingLeft: 12}}>My Sports</Text>
      <View>
        {sports && sports.length > 0 ? (
          sports.map((sport: SportType) => (
            <Sport key={sport.id} sport={sport} />
          ))
        ) : (
          <Text className="text-lg" style={{ paddingLeft: 12 }}>No sports yet</Text>
        )}
      </View>
    </View>
  );
}
