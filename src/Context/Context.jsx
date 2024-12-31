// Context.jsx
import React, { createContext, useContext, useState, useRef } from 'react';


const PlayerContext = createContext();


export const PlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const Latest = [
    { 
"id": "zDzWQVkb",
"name": "Akhiyaan Gulaab",
"type": "",
"album": {
"id": "51655854",
"name": "Teri Baaton Mein Aisa Uljha Jiya",
"url": "https://www.jiosaavn.com/album/teri-baaton-mein-aisa-uljha-jiya/MJVyyWfhWe4_"
},
"year": "2024",
"releaseDate": null,
"duration": "171",
"label": "T-Series",
"primaryArtists": "Mitraz",
"primaryArtistsId": "7634460",
"featuredArtists": "",
"featuredArtistsId": "",
"explicitContent": 0,
"playCount": "34962146",
"language": "hindi",
"hasLyrics": "true",
"url": "https://www.jiosaavn.com/song/akhiyaan-gulaab/CiwRZiVmXFE",
"copyright": "℗ 2024 Super Cassettes Industries Private Limited",
"image": [
{
"quality": "50x50",
"link": "https://c.saavncdn.com/214/Teri-Baaton-Mein-Aisa-Uljha-Jiya-Hindi-2024-20240205151011-50x50.jpg"
},
{
"quality": "150x150",
"link": "https://c.saavncdn.com/214/Teri-Baaton-Mein-Aisa-Uljha-Jiya-Hindi-2024-20240205151011-150x150.jpg"
},
{
"quality": "500x500",
"link": "https://c.saavncdn.com/214/Teri-Baaton-Mein-Aisa-Uljha-Jiya-Hindi-2024-20240205151011-500x500.jpg"
}
],
"downloadUrl": [
{
"quality": "12kbps",
"link": "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_12.mp4"
},
{
"quality": "48kbps",
"link": "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_48.mp4"
},
{
"quality": "96kbps",
"link": "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_96.mp4"
},
{
"quality": "160kbps",
"link": "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_160.mp4"
},
{
"quality": "320kbps",
"link": "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_320.mp4"
}
]
},
{
"id": "ZhiCCQjX",
"name": "Khayaal",
"type": "",
"album": {
"id": "39334116",
"name": "Zehen",
"url": "https://www.jiosaavn.com/album/zehen/iTZn0I8S-b4_"
},
"year": "2022",
"releaseDate": null,
"duration": "189",
"label": "Mitraz Records",
"primaryArtists": "Mitraz",
"primaryArtistsId": "7634460",
"featuredArtists": "",
"featuredArtistsId": "",
"explicitContent": 0,
"playCount": "610087",
"language": "hindi",
"hasLyrics": "true",
"url": "https://www.jiosaavn.com/song/khayaal/KgACcjdhXWs",
"copyright": "℗ 2022 Mitraz Records",
"image": [
{
"quality": "50x50",
"link": "https://c.saavncdn.com/592/Zehen-Hindi-2022-20221024154251-50x50.jpg"
},
{
"quality": "150x150",
"link": "https://c.saavncdn.com/592/Zehen-Hindi-2022-20221024154251-150x150.jpg"
},
{
"quality": "500x500",
"link": "https://c.saavncdn.com/592/Zehen-Hindi-2022-20221024154251-500x500.jpg"
}
],
"downloadUrl": [
{
"quality": "12kbps",
"link": "https://aac.saavncdn.com/592/90178162570a5e275d207f424c61c2e3_12.mp4"
},
{
"quality": "48kbps",
"link": "https://aac.saavncdn.com/592/90178162570a5e275d207f424c61c2e3_48.mp4"
},
{
"quality": "96kbps",
"link": "https://aac.saavncdn.com/592/90178162570a5e275d207f424c61c2e3_96.mp4"
},
{
"quality": "160kbps",
"link": "https://aac.saavncdn.com/592/90178162570a5e275d207f424c61c2e3_160.mp4"
},
{
"quality": "320kbps",
"link": "https://aac.saavncdn.com/592/90178162570a5e275d207f424c61c2e3_320.mp4"
}
]
},
{
"id": "eFMP6FoG",
"name": "Muskurahat",
"type": "",
"album": {
"id": "35910780",
"name": "Muskurahat",
"url": "https://www.jiosaavn.com/album/muskurahat/J-Z0E-IgzG4_"
},
"year": "2022",
"releaseDate": null,
"duration": "259",
"label": "Mitraz Records",
"primaryArtists": "Mitraz",
"primaryArtistsId": "7634460",
"featuredArtists": "",
"featuredArtistsId": "",
"explicitContent": 0,
"playCount": "790754",
"language": "hindi",
"hasLyrics": "true",
"url": "https://www.jiosaavn.com/song/muskurahat/FS4mYUJ2WHQ",
"copyright": "℗ 2022 Mitraz Records",
"image": [
{
"quality": "50x50",
"link": "https://c.saavncdn.com/147/Muskurahat-Hindi-2022-20220622105135-50x50.jpg"
},
{
"quality": "150x150",
"link": "https://c.saavncdn.com/147/Muskurahat-Hindi-2022-20220622105135-150x150.jpg"
},
{
"quality": "500x500",
"link": "https://c.saavncdn.com/147/Muskurahat-Hindi-2022-20220622105135-500x500.jpg"
}
],
"downloadUrl": [
{
"quality": "12kbps",
"link": "https://aac.saavncdn.com/147/60c4a680e0d7ab281d22a87fe533a385_12.mp4"
},
{
"quality": "48kbps",
"link": "https://aac.saavncdn.com/147/60c4a680e0d7ab281d22a87fe533a385_48.mp4"
},
{
"quality": "96kbps",
"link": "https://aac.saavncdn.com/147/60c4a680e0d7ab281d22a87fe533a385_96.mp4"
},
{
"quality": "160kbps",
"link": "https://aac.saavncdn.com/147/60c4a680e0d7ab281d22a87fe533a385_160.mp4"
},
{
"quality": "320kbps",
"link": "https://aac.saavncdn.com/147/60c4a680e0d7ab281d22a87fe533a385_320.mp4"
}
]
},
{
    "id": "wvPEB8D5",
    "name": "Khwahish",
    "type": "",
    "album": {
    "id": "39399104",
    "name": "Khwahish",
    "url": "https://www.jiosaavn.com/album/khwahish/Idtp-GT6h,8_"
    },
    "year": "2022",
    "releaseDate": null,
    "duration": "145",
    "label": "Sony Music Entertainment India Pvt. Ltd.",
    "primaryArtists": "Mitraz, Arooh",
    "primaryArtistsId": "7634460, 13313755",
    "featuredArtists": "",
    "featuredArtistsId": "",
    "explicitContent": 0,
    "playCount": "689315",
    "language": "hindi",
    "hasLyrics": "false",
    "url": "https://www.jiosaavn.com/song/khwahish/Bx47dDYIcwY",
    "copyright": "(P) 2022 Sony Music Entertainment India Pvt. Ltd.",
    "image": [
    {
    "quality": "50x50",
    "link": "https://c.saavncdn.com/783/Khwahish-Hindi-2022-20221026172858-50x50.jpg"
    },
    {
    "quality": "150x150",
    "link": "https://c.saavncdn.com/783/Khwahish-Hindi-2022-20221026172858-150x150.jpg"
    },
    {
    "quality": "500x500",
    "link": "https://c.saavncdn.com/783/Khwahish-Hindi-2022-20221026172858-500x500.jpg"
    }
    ],
    "downloadUrl": [
    {
    "quality": "12kbps",
    "link": "https://aac.saavncdn.com/783/24633cd3cc90f47b61422e867693410b_12.mp4"
    },
    {
    "quality": "48kbps",
    "link": "https://aac.saavncdn.com/783/24633cd3cc90f47b61422e867693410b_48.mp4"
    },
    {
    "quality": "96kbps",
    "link": "https://aac.saavncdn.com/783/24633cd3cc90f47b61422e867693410b_96.mp4"
    },
    {
    "quality": "160kbps",
    "link": "https://aac.saavncdn.com/783/24633cd3cc90f47b61422e867693410b_160.mp4"
    },
    {
    "quality": "320kbps",
    "link": "https://aac.saavncdn.com/783/24633cd3cc90f47b61422e867693410b_320.mp4"
    }
    ]
    },
    {
        "id": "aebrL2fu",
        "name": "Tu Aake Dekhle",
        "type": "",
        "album": {
        "id": "45948291",
        "name": "The Carnival",
        "url": "https://www.jiosaavn.com/album/the-carnival/vjP9,jz8V0I_"
        },
        "year": "2020",
        "releaseDate": null,
        "duration": "270",
        "label": "Warner Music India",
        "primaryArtists": "King",
        "primaryArtistsId": "14327531",
        "featuredArtists": "",
        "featuredArtistsId": "",
        "explicitContent": 1,
        "playCount": "42286534",
        "language": "hindi",
        "hasLyrics": "true",
        "url": "https://www.jiosaavn.com/song/tu-aake-dekhle/EQ0JQzgCUUY",
        "copyright": "℗ 2020 KingsClan Records",
        "image": [
        {
        "quality": "50x50",
        "link": "https://c.saavncdn.com/275/The-Carnival-Hindi-2020-20230718172154-50x50.jpg"
        },
        {
        "quality": "150x150",
        "link": "https://c.saavncdn.com/275/The-Carnival-Hindi-2020-20230718172154-150x150.jpg"
        },
        {
        "quality": "500x500",
        "link": "https://c.saavncdn.com/275/The-Carnival-Hindi-2020-20230718172154-500x500.jpg"
        }
        ],
        "downloadUrl": [
        {
        "quality": "12kbps",
        "link": "https://aac.saavncdn.com/275/cb7c6e55ffa7a4a0dfb5835ffe7a74c5_12.mp4"
        },
        {
        "quality": "48kbps",
        "link": "https://aac.saavncdn.com/275/cb7c6e55ffa7a4a0dfb5835ffe7a74c5_48.mp4"
        },
        {
        "quality": "96kbps",
        "link": "https://aac.saavncdn.com/275/cb7c6e55ffa7a4a0dfb5835ffe7a74c5_96.mp4"
        },
        {
        "quality": "160kbps",
        "link": "https://aac.saavncdn.com/275/cb7c6e55ffa7a4a0dfb5835ffe7a74c5_160.mp4"
        },
        {
        "quality": "320kbps",
        "link": "https://aac.saavncdn.com/275/cb7c6e55ffa7a4a0dfb5835ffe7a74c5_320.mp4"
        }
        ]
        },
        {
            "id": "IrEzzCfb",
            "name": "Maan Meri Jaan",
            "type": "",
            "album": {
            "id": "38893739",
            "name": "Champagne Talk",
            "url": "https://www.jiosaavn.com/album/champagne-talk/8O,CIqHgSR0_"
            },
            "year": "2022",
            "releaseDate": null,
            "duration": "194",
            "label": "Warner Music India",
            "primaryArtists": "King",
            "primaryArtistsId": "14327531",
            "featuredArtists": "",
            "featuredArtistsId": "",
            "explicitContent": 1,
            "playCount": "105929756",
            "language": "hindi",
            "hasLyrics": "false",
            "url": "https://www.jiosaavn.com/song/maan-meri-jaan/ORouSw5zUVE",
            "copyright": "2022 Warner Music India, ℗ 2022 Warner Music India",
            "image": [
            {
            "quality": "50x50",
            "link": "https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-50x50.jpg"
            },
            {
            "quality": "150x150",
            "link": "https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-150x150.jpg"
            },
            {
            "quality": "500x500",
            "link": "https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-500x500.jpg"
            }
            ],
            "downloadUrl": [
            {
            "quality": "12kbps",
            "link": "https://aac.saavncdn.com/734/31a101fae38e184208e5f95e3e6c756d_12.mp4"
            },
            {
            "quality": "48kbps",
            "link": "https://aac.saavncdn.com/734/31a101fae38e184208e5f95e3e6c756d_48.mp4"
            },
            {
            "quality": "96kbps",
            "link": "https://aac.saavncdn.com/734/31a101fae38e184208e5f95e3e6c756d_96.mp4"
            },
            {
            "quality": "160kbps",
            "link": "https://aac.saavncdn.com/734/31a101fae38e184208e5f95e3e6c756d_160.mp4"
            },
            {
            "quality": "320kbps",
            "link": "https://aac.saavncdn.com/734/31a101fae38e184208e5f95e3e6c756d_320.mp4"
            }
            ]
            },
            {
                "id": "02ANUhYZ",
                "name": "Manma Emotion Jaage",
                "type": "",
                "album": {
                "id": "1629673",
                "name": "Dilwale (Original Motion Picture Soundtrack)",
                "url": "https://www.jiosaavn.com/album/dilwale-original-motion-picture-soundtrack/ib0P9ORJ,zo_"
                },
                "year": "2015",
                "releaseDate": null,
                "duration": "209",
                "label": "Sony Music Entertainment India Pvt. Ltd.",
                "primaryArtists": "Amit Mishra, Anushka Manchanda, Antara Mitra, Pritam",
                "primaryArtistsId": "461985, 455284, 458926, 456323",
                "featuredArtists": "",
                "featuredArtistsId": "",
                "explicitContent": 0,
                "playCount": "20793709",
                "language": "hindi",
                "hasLyrics": "false",
                "url": "https://www.jiosaavn.com/song/manma-emotion-jaage/QFoqfyFYbmk",
                "copyright": "©  2015 Sony Music Entertainment India Pvt. Ltd.",
                "image": [
                {
                "quality": "50x50",
                "link": "https://c.saavncdn.com/821/Dilwale-Hindi-2015-50x50.jpg"
                },
                {
                "quality": "150x150",
                "link": "https://c.saavncdn.com/821/Dilwale-Hindi-2015-150x150.jpg"
                },
                {
                "quality": "500x500",
                "link": "https://c.saavncdn.com/821/Dilwale-Hindi-2015-500x500.jpg"
                }
                ],
                "downloadUrl": [
                {
                "quality": "12kbps",
                "link": "https://aac.saavncdn.com/735/7915d15539ddbda0894b1a10c67a96bc_12.mp4"
                },
                {
                "quality": "48kbps",
                "link": "https://aac.saavncdn.com/735/7915d15539ddbda0894b1a10c67a96bc_48.mp4"
                },
                {
                "quality": "96kbps",
                "link": "https://aac.saavncdn.com/735/7915d15539ddbda0894b1a10c67a96bc_96.mp4"
                },
                {
                "quality": "160kbps",
                "link": "https://aac.saavncdn.com/735/7915d15539ddbda0894b1a10c67a96bc_160.mp4"
                },
                {
                "quality": "320kbps",
                "link": "https://aac.saavncdn.com/735/7915d15539ddbda0894b1a10c67a96bc_320.mp4"
                }
                ]
                },
                {
                    "id": "TU3x0y2f",
                    "name": "Ohdi Ankh Bhi Kamini Mera Dil Bhi Kamina",
                    "type": "",
                    "album": {},
                    "year": "2021",
                    "releaseDate": null,
                    "duration": "248",
                    "label": "Goyal Music",
                    "primaryArtists": "Namar Gill",
                    "primaryArtistsId": "824508",
                    "featuredArtists": "",
                    "featuredArtistsId": "",
                    "explicitContent": 0,
                    "playCount": "726591",
                    "language": "punjabi",
                    "hasLyrics": "false",
                    "url": "https://www.jiosaavn.com/song/ohdi-ankh-bhi-kamini-mera-dil-bhi-kamina/JD1YSURJBVU",
                    "copyright": "© 2021 Goyal Music",
                    "image": [
                    {
                    "quality": "50x50",
                    "link": "https://c.saavncdn.com/430/Ohdi-Ankh-Bhi-Kamini-Mera-Dil-Bhi-Kamina-Punjabi-2021-20210827124557-50x50.jpg"
                    },
                    {
                    "quality": "150x150",
                    "link": "https://c.saavncdn.com/430/Ohdi-Ankh-Bhi-Kamini-Mera-Dil-Bhi-Kamina-Punjabi-2021-20210827124557-150x150.jpg"
                    },
                    {
                    "quality": "500x500",
                    "link": "https://c.saavncdn.com/430/Ohdi-Ankh-Bhi-Kamini-Mera-Dil-Bhi-Kamina-Punjabi-2021-20210827124557-500x500.jpg"
                    }
                    ],
                    "downloadUrl": [
                    {
                    "quality": "12kbps",
                    "link": "https://aac.saavncdn.com/430/5afc5bc4d08cdc734cdec8df649df7d3_12.mp4"
                    },
                    {
                    "quality": "48kbps",
                    "link": "https://aac.saavncdn.com/430/5afc5bc4d08cdc734cdec8df649df7d3_48.mp4"
                    },
                    {
                    "quality": "96kbps",
                    "link": "https://aac.saavncdn.com/430/5afc5bc4d08cdc734cdec8df649df7d3_96.mp4"
                    },
                    {
                    "quality": "160kbps",
                    "link": "https://aac.saavncdn.com/430/5afc5bc4d08cdc734cdec8df649df7d3_160.mp4"
                    },
                    {
                    "quality": "320kbps",
                    "link": "https://aac.saavncdn.com/430/5afc5bc4d08cdc734cdec8df649df7d3_320.mp4"
                    }
                    ]
                    }
                
]
const TopArtists = [
  {
      "id": "459633",
      "name": "Atif Aslam",
      "url": "https://www.jiosaavn.com/artist/atif-aslam-songs/MXn8bhT308U_",
      "role": "Artist",
      "image": [
      {
      "quality": "50x50",
      "link": "https://c.saavncdn.com/artists/Atif_Aslam_50x50.jpg"
      },
      {
      "quality": "150x150",
      "link": "https://c.saavncdn.com/artists/Atif_Aslam_150x150.jpg"
      },
      {
      "quality": "500x500",
      "link": "https://c.saavncdn.com/artists/Atif_Aslam_500x500.jpg"
      }
      ],
      "isRadioPresent": true
      },
      {
          "id": "459320",
          "name": "Arijit Singh",
          "url": "https://www.jiosaavn.com/artist/arijit-singh-songs/LlRWpHzy3Hk_",
          "role": "Artist",
          "image": [
          {
          "quality": "50x50",
          "link": "https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_50x50.jpg"
          },
          {
          "quality": "150x150",
          "link": "https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_150x150.jpg"
          },
          {
          "quality": "500x500",
          "link": "https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_500x500.jpg"
          }
          ],
          "isRadioPresent": true
          },
          {
              "id": "468245",
              "name": "Diljit Dosanjh",
              "url": "https://www.jiosaavn.com/artist/diljit-dosanjh-songs/oIVHdWIO5F8_",
              "role": "Artist",
              "image": [
              {
              "quality": "50x50",
              "link": "https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_50x50.jpg"
              },
              {
              "quality": "150x150",
              "link": "https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_150x150.jpg"
              },
              {
              "quality": "500x500",
              "link": "https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_500x500.jpg"
              }
              ],
              "isRadioPresent": true
              },
              {
                  "id": "568565",
                  "name": "Justin Bieber",
                  "url": "https://www.jiosaavn.com/artist/justin-bieber-songs/deJJWFd1ItE_",
                  "role": "Artist",
                  "image": [
                  {
                  "quality": "50x50",
                  "link": "https://c.saavncdn.com/artists/Justin_Bieber_005_20201127112218_50x50.jpg"
                  },
                  {
                  "quality": "150x150",
                  "link": "https://c.saavncdn.com/artists/Justin_Bieber_005_20201127112218_150x150.jpg"
                  },
                  {
                  "quality": "500x500",
                  "link": "https://c.saavncdn.com/artists/Justin_Bieber_005_20201127112218_500x500.jpg"
                  }
                  ],
                  "isRadioPresent": true
                  },
                  {
                      "id": "464932",
                      "name": "Neha Kakkar",
                      "url": "https://www.jiosaavn.com/artist/neha-kakkar-songs/EkEBV7JAU-I_",
                      "role": "Artist",
                      "image": [
                      {
                      "quality": "50x50",
                      "link": "https://c.saavncdn.com/artists/Neha_Kakkar_006_20200822042626_50x50.jpg"
                      },
                      {
                      "quality": "150x150",
                      "link": "https://c.saavncdn.com/artists/Neha_Kakkar_006_20200822042626_150x150.jpg"
                      },
                      {
                      "quality": "500x500",
                      "link": "https://c.saavncdn.com/artists/Neha_Kakkar_006_20200822042626_500x500.jpg"
                      }
                      ],
                      "isRadioPresent": true
                      },
                      {
                          "id": "485956",
                          "name": "Yo Yo Honey Singh",
                          "url": "https://www.jiosaavn.com/artist/yo-yo-honey-singh-songs/06QxyAvVpB4_",
                          "role": "Artist",
                          "image": [
                          {
                          "quality": "50x50",
                          "link": "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_002_20221216102650_50x50.jpg"
                          },
                          {
                          "quality": "150x150",
                          "link": "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_002_20221216102650_150x150.jpg"
                          },
                          {
                          "quality": "500x500",
                          "link": "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_002_20221216102650_500x500.jpg"
                          }
                          ],
                          "isRadioPresent": true
                          }  ,
                          {
                              "id": "456863",
                              "name": "Badshah",
                              "url": "https://www.jiosaavn.com/artist/badshah-songs/d4OwAaEcnD0_",
                              "role": "Artist",
                              "image": [
                              {
                              "quality": "50x50",
                              "link": "https://c.saavncdn.com/artists/Badshah_005_20230608084021_50x50.jpg"
                              },
                              {
                              "quality": "150x150",
                              "link": "https://c.saavncdn.com/artists/Badshah_005_20230608084021_150x150.jpg"
                              },
                              {
                              "quality": "500x500",
                              "link": "https://c.saavncdn.com/artists/Badshah_005_20230608084021_500x500.jpg"
                              }
                              ],
                              "isRadioPresent": true
                              },
                              {
                                  "id": "464656",
                                  "name": "Armaan Malik",
                                  "url": "https://www.jiosaavn.com/artist/armaan-malik-songs/1iZ7Gi0bi1Y_",
                                  "role": "Artist",
                                  "image": [
                                  {
                                  "quality": "50x50",
                                  "link": "https://c.saavncdn.com/artists/Armaan_Malik_005_20240819091627_50x50.jpg"
                                  },
                                  {
                                  "quality": "150x150",
                                  "link": "https://c.saavncdn.com/artists/Armaan_Malik_005_20240819091627_150x150.jpg"
                                  },
                                  {
                                  "quality": "500x500",
                                  "link": "https://c.saavncdn.com/artists/Armaan_Malik_005_20240819091627_500x500.jpg"
                                  }
                                  ],
                                  "isRadioPresent": true
                                  },
                                  {
                                      "id": "881158",
                                      "name": "Jubin Nautiyal",
                                      "url": "https://www.jiosaavn.com/artist/jubin-nautiyal-songs/uGdfg6zGf4s_",
                                      "role": "Artist",
                                      "image": [
                                      {
                                      "quality": "50x50",
                                      "link": "https://c.saavncdn.com/artists/Jubin_Nautiyal_003_20231130204020_50x50.jpg"
                                      },
                                      {
                                      "quality": "150x150",
                                      "link": "https://c.saavncdn.com/artists/Jubin_Nautiyal_003_20231130204020_150x150.jpg"
                                      },
                                      {
                                      "quality": "500x500",
                                      "link": "https://c.saavncdn.com/artists/Jubin_Nautiyal_003_20231130204020_500x500.jpg"
                                      }
                                      ],
                                      "isRadioPresent": true
                                      },
                                      {
                                          "id": "455782",
                                          "name": "KK",
                                          "url": "https://www.jiosaavn.com/artist/kk-songs/K,5uNVM,qpM_",
                                          "role": "Artist",
                                          "image": [
                                          {
                                          "quality": "50x50",
                                          "link": "https://c.saavncdn.com/artists/KK_50x50.jpg"
                                          },
                                          {
                                          "quality": "150x150",
                                          "link": "https://c.saavncdn.com/artists/KK_150x150.jpg"
                                          },
                                          {
                                          "quality": "500x500",
                                          "link": "https://c.saavncdn.com/artists/KK_500x500.jpg"
                                          }
                                          ],
                                          "isRadioPresent": true
                                          }    



]
const [isOpen, setIsOpen] = useState(false);
const [isArtistOpen, setIsArtistOpen] = useState(false)
const [isCategoryOpen, setIsCategoryOpen] = useState(false);
const audioRef = useRef(new Audio());
const [musicDuration, setMusicDuration] = useState(0);
const [currentTime, setCurrentTime] = useState(0);
const [pausedTime, setPausedTime] = useState(0);

  const [audioQuality, setAudioQuality] = useState(() => {
  const getAudioQuality = localStorage.getItem('quality');
  return getAudioQuality ? parseInt(getAudioQuality, 10) : 2;
});

const toggleArtistDrawer = () => {
  setIsArtistOpen(!isArtistOpen)
}
const toggleCategoryDrawer = () => {
  setIsCategoryOpen(!isCategoryOpen)
}

const toggleDrawer = () => {
  setIsOpen(!isOpen);
};

  
const playSong = (url) => {
  // If it's the same song, resume from the paused time
  if (currentSong && currentSong.downloadUrl === url) {
    audioRef.current.currentTime = pausedTime;
  } else {
    // For a new song, reset to the beginning
    audioRef.current.currentTime = 0;
  }

  // Set the song URL
  audioRef.current.src = url;
  audioRef.current.play();
  setIsPlaying(true);
};




 
const togglePlayPause = () => {
  if (isPlaying) {
    // Pause the audio and save the current time
    audioRef.current.pause();
    setCurrentTime(audioRef.current.currentTime);  // Save the position
  } else {
    // Play the audio and resume from the saved position
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);  // Toggle play/pause state
};

  return (
    <PlayerContext.Provider value={{ pausedTime, setPausedTime,  musicDuration, currentTime ,setMusicDuration, setCurrentTime,  audioRef, isPlaying, togglePlayPause, playSong, currentSong, setCurrentSong,  setIsPlaying, Latest, TopArtists, isOpen, toggleDrawer, isArtistOpen, isCategoryOpen, toggleArtistDrawer, toggleCategoryDrawer}}>
      {children}
    </PlayerContext.Provider>
  );
};


export const usePlayer = () => useContext(PlayerContext);
