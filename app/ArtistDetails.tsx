import React, { useEffect, useState } from "react";
import { StyleSheet,  Pressable, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import axios, { AxiosResponse } from "axios"; // Import AxiosResponse for correct typing
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import { useThemeColor } from "@/components/Themed";



type ArtistDetailsRouteProp = RouteProp<RootStackParamList, "ArtistDetails">;

interface Song {
  id: number;
  title: string;
  artist: string;
}

export default function ArtistDetails() {

    const buttonColor = useThemeColor({}, "button");
    const buttonPressedColor = useThemeColor({}, "buttonPressed");  
  const route = useRoute<ArtistDetailsRouteProp>();
  const { artist } = route.params;
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/artists/${artist}`) // Adjust the API endpoint to fetch songs by the artist
      .then((response: AxiosResponse<Song[]>) => {
        setArtistSongs(response.data);
      })
      .catch((error) => console.error(error));
  }, [artist]);

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; artist: string };
  }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: pressed ? buttonPressedColor : buttonColor },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text style={styles.title}>
        {item.title}
        <Text style={styles.artist}> {item.artist}</Text>
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{artist}'s Songs</Text>
      <FlatList
        data={artistSongs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    width: "100%",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemPressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
});