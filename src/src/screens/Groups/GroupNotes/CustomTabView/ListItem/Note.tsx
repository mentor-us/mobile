import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {StyleSheet} from "react-native";
import {NoteModel} from "~/models/message";
import {DuyNguyenImage} from "~/assets/images";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

interface Props {
  data?: NoteModel;
}

const mockdata: NoteModel = {
  creator: {
    id: "495",
    name: "Duy Nguyễn",
    imageUrl:
      "https://lh3.googleusercontent.com/hn6hJQjH3TYPNVnDehTEII9j6NcjL9fMUMUb9zkPBnQfyHF7Gzkp7eWf6Eup7rWxFbIsYLNRWQWVACRsomrYj9eDtGUgfvbeF-EADGrwg3pLPajcbd90g5oju0cbSgt3wzygJvflwtBhnwyEyGMJJYdY3DNR3ePuvSLHROnxe9Y2M4_EJIdEjm0dAHu9V65k9m_UFiMMllsKuGEDGYv36KI3Vcr45tw1a4qXljA2Wa2l9flWItNVJhjJi4G4qkxGErrOEO61TEmXHBWXydM8jHT4jdiz2GdSu-C1NGwOP9AtjDO0Vxl7jl0AxxvySB0X6Sqay4PZlXz7OO9r1Kcen0890rL40fYIjXLOKtpvwEoZ_SYI8whO2M8hEo367LETW2rJGN4jIM-7gqwk0i4z_WiFYCM6ugTSwXu_B2JHb1WNpsW9hANOLR5HpUi05-6Hu0K9Sr68wuDtPUZNUj1PswbEBUxlJS1eQ5RaUGGpcYrSBEWtvgCSuGWxYVytORrGraZVL-OrVsJ0qqZJN3uhMxfV4id3MrJ_498xl54ZaKbL2Dhb989Z_F4TpeBTHxGK9j3nF7OdbbE6D_pAsKpm4eYNxGeO_-NTjGMDYYNf9_jDruv0UzCItmr89eHH1YNl7jX7SoRraIHesjpcx1P82wE-oVPM0Si1JCE5majUgxC18V5RBQU7vj2sac4-ywKwwBdaJUWh7RRqWeDx8invbDhKAx3_yk4oneYfRTwNM28FrVZGMgamMEi3u2f19F1iG_R8skSzTIlWSplJD_DG0gamX3Tgfau8bBDPZnq_ZHveXIDZKrZIbNRfQbjkljKubtT0lDLqS6_8f_YbWTiR9ypnGbf_c8h2PcjXhASEL2Nco8Szyx8QyULQ_CH7SicCY4ACOfnNyvWvRGpe9fwcdHi_ZMABeReFoQH9tf41knCq=w234-h292-no?authuser=0",
  },
  timeDesc: "07/11/2022",
  content: "test ghi chú",
};

const Note = ({data = mockdata}: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      {/* Creator */}
      <View style={styles.creatorCtn}>
        <Image source={DuyNguyenImage} style={styles.avatar} />
        <View style={styles.creatorInfoCtn}>
          <Text style={styles.creatorName}>{data.creator.name}</Text>
          <Text style={styles.timeDesc}>{data.timeDesc}</Text>
        </View>
      </View>
      {/* note */}
      <Text numberOfLines={2} style={styles.note}>
        {data.content}
      </Text>
    </TouchableOpacity>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    padding: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creatorCtn: {
    flexDirection: "row",
    marginBottom: 8,
  },
  creatorName: {
    color: Color.primary,
    fontSize: FontSize.large,
    fontWeight: "bold",
  },
  timeDesc: {
    color: Color.text[5],
    fontSize: FontSize.normal,
  },
  creatorInfoCtn: {
    paddingHorizontal: 8,
  },
  note: {
    color: Color.black,
    fontSize: FontSize.large,
  },
});
