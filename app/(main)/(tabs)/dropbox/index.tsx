import { View, Text } from "react-native";
import React from "react";
import { listDropboxFiles, ListOfFiles } from "../../../../data/dropboxUtils";

const DropboxFiles = () => {
  const [files, setFiles] = React.useState<ListOfFiles>();
  React.useEffect(() => {
    const getFiles = async () => {
      const files = await listDropboxFiles();
      setFiles(files);
    };
    getFiles();
  }, []);

  console.log("files", files.entries);
  return (
    <View>
      <Text>DropboxFiles</Text>
    </View>
  );
};

export default DropboxFiles;
