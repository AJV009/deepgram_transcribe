const fs = require('fs')
const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')

const deepgram = new Deepgram('bd56fcf24409c7322596451a8ae368c1d413b38c')
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: './',
  youtubeVideoQuality: 'highestaudio',
})

YD.download('ir-mWUYH_uo')

YD.on('progress', (data) => {
  console.log(data.progress.percentage + '% downloaded')
})

YD.on('finished', async (err, video) => {
  const videoFileName = video.file
  console.log(`Downloaded ${videoFileName}`)

  const file = {
    buffer: fs.readFileSync(videoFileName),
    mimetype: 'audio/mp3',
  }
  const options = {
    punctuate: true,
  }
  
  const result = await deepgram.transcription
    .preRecorded(file, options)
    .catch((e) => console.log(e))
  console.log(result)
  
  const transcript = result.results.channels[0].alternatives[0].transcript
  
  fs.writeFileSync(
      `${videoFileName}.txt`,
      transcript,
      () => `Wrote ${videoFileName}.txt`
    )
  
    fs.unlinkSync(videoFileName)
    
})
