// https://www.section.io/engineering-education/rendering-html-pages-as-a-http-server-response-using-node-js/
const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const sc = require("supercolliderjs")

function linearScale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function exponentialScale(num, in_min, in_max, out_min, out_max) {
    return Math.pow(out_max / out_min, (num - in_min) / (in_max - in_min)) * out_min
}

app.listen(3000, () => {
    console.log("Application started and Listening on port http://127.0.0.1:3000/")
})

// serve your css as static
app.use(express.static(__dirname))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
const jsonParser = bodyParser.json()
let prevFreq

sc.server.boot({ memSize: '262144', maxSynthDefs: '4096' }).then(async server => {
    const sonificationVoice = await server.synthDef(
        "/dataset",
        `
      SynthDef("/dataset", { arg out = 0, frequency = 440, frequency1 = 440, frequency2 = 440, soundlevel = 0, wavemix = 0, 
        attack = 0.001, release = 0.5, clip = 1, noiselevel = 0, lfoLevel = 1, lfoFreq = 10, timbreMixLevel = 0, 
        sineLevel = 0, triLevel = 0, squareLevel = 0, sawLevel = 0, whiteNoiseLevel = 0, pinkNoiseLevel = 0, crackleNoiseLevel = 0, 
        t_trig = 0, gate = 0, sustain = 0, lpfCutoff = 200, bpfCutoff = 200, hpfCutoff = 200, brfCutoff = 200, mixedSoundLevel = 1, 
        lpfLevel = 0, bpfLevel = 0, hpfLevel = 0, brfLevel = 0, pw = 0.5, lagTime = 0.01, filterLag = 0.01,
        reverbMix = 0.1, reverberation = 0.5, delayTime = 0.33, decay = 0.5, delayLevel = 0;  

        var noise = WhiteNoise.ar(whiteNoiseLevel) + PinkNoise.ar(pinkNoiseLevel) + Dust.ar(440, crackleNoiseLevel);
        var sine0 = SinOsc.ar(frequency);
        var sine1 = SinOsc.ar(frequency1);
        var sine2 = SinOsc.ar(frequency2);
        var sine = (sine0 + sine1 + sine2) / 3;
        var tri0 = LFTri.ar(frequency);
        var tri1 = LFTri.ar(frequency1);
        var tri2 = LFTri.ar(frequency2);
        var tri = (tri0 + tri1 + tri2) / 3;
        var sqr0 = LFPulse.ar(frequency, width: pw);
        var sqr1 = LFPulse.ar(frequency1, width: pw);
        var sqr2 = LFPulse.ar(frequency2, width: pw);
        var sqr = (sqr0 + sqr1 + sqr2) / 3;
        var saw0 = LFSaw.ar(frequency);
        var saw1 = LFSaw.ar(frequency1);
        var saw2 = LFSaw.ar(frequency2);
        var saw = (saw0 + saw1 + saw2) / 3;
        var toneMix = (sine * sineLevel) + (tri * triLevel) + (sqr * squareLevel) + (saw * sawLevel);
        var timbremix = (saw * wavemix) + ((1 - wavemix) * sine);
        var mixed = toneMix + (timbremix * timbreMixLevel);
        var clipped = mixed.clip2(clip) * (2 - clip * (1.5 - clip));
        var mixedSound = clipped + (noise * noiselevel);
        var lowPassFiltered = LPF.ar(mixedSound, lpfCutoff.lag(filterLag));
        var bandPassFiltered = BPF.ar(mixedSound, bpfCutoff.lag(filterLag), 1);
        var highPassFiltered = HPF.ar(mixedSound, hpfCutoff.lag(filterLag));
        var bandRejectFiltered = BRF.ar(mixedSound, brfCutoff.lag(filterLag), 1);
        var filteredSound = (mixedSound * mixedSoundLevel) + (lowPassFiltered * lpfLevel.lag(lagTime)) + (bandPassFiltered * bpfLevel.lag(lagTime)) + (highPassFiltered * hpfLevel.lag(lagTime)) + (bandRejectFiltered * brfLevel.lag(lagTime));
        var lfo = LFPulse.kr(lfoFreq, width: 0.4).range(lfoLevel, 1);
        var envelope1 = EnvGen.kr(Env.perc(attack, release, 1, -4), t_trig);
        var envelope2 = EnvGen.kr(Env.adsr(attack, 0.5, 1, release, 1, -4), gate);
        var enveloped1 = (filteredSound * envelope1) * lfo;
        var enveloped2 = (filteredSound * envelope2) * lfo;
        var enveloped = (sustain * enveloped2) + ((1 - sustain) * enveloped1);
        var output = enveloped;
        //var stereoOut = [output, output] * soundlevel;

        var deleyed = output + (LocalIn.ar(2) * delayLevel);
        var stereoOut = FreeVerb2.ar(deleyed[0], deleyed[1], reverbMix, reverberation, 0.1, 1) * soundlevel;
        LocalOut.ar(DelayL.ar(deleyed, 0.5, delayTime) * decay);
        Out.ar(out, stereoOut);
      });
    `,
    )

    app.post("/data", jsonParser, async (req, res) => {
        const data = req.body // Read the body of the sent message

        // Data ranges
        const minFreq = data.mirror ? 1200 : 100
        const maxFreq = data.mirror ? 100 : 1200

        const minNote = data.mirror ? 1760 : 110
        const maxNote = data.mirror ? 110 : 1760

        // Send data value to synth
        server.synth(sonificationVoice, {
            frequency: data.discrete ? exponentialScale(data.value, data.min, data.max, minNote, maxNote) : linearScale(data.value, data.min, data.max, minFreq, maxFreq),
            frequency1: data.discrete ? exponentialScale(data.value, data.min, data.max, minNote, maxNote) : linearScale(data.value, data.min, data.max, minFreq, maxFreq),
            frequency2: data.discrete ? exponentialScale(data.value, data.min, data.max, minNote, maxNote) : linearScale(data.value, data.min, data.max, minFreq, maxFreq),

            soundlevel: data.volume ? linearScale(data.value, data.min, data.max, data.mirror ? 0.5 : 0, data.mirror ? 0 : 0.5) : 0.5,

            // Waveform
            sineLevel: data.waveform == 'Sin' ? 1 : 0,
            triLevel: data.waveform == 'Tri' ? 1 : 0,
            squareLevel: data.waveform == 'Square' ? 1 : 0,
            sawLevel: data.waveform == 'Saw' ? 1 : 0,
            whiteNoiseLevel: data.waveform == 'Noise' ? 1 : 0,
            noiselevel: data.waveform == 'Noise' ? 1 : 0,

            // Filter
            lpfLevel: data.filter == 'LP' ? 1 : 0,
            lpfCutoff: 100 + 500 - exponentialScale(data.value, data.min, data.max, 100, 500),

            hpfLevel: data.filter == 'HP' ? 1 : 0,
            hpfCutoff: 100 + 500 - exponentialScale(data.value, data.min, data.max, 100, 500),

            bpfLevel: data.filter == 'BP' ? 1 : 0,
            bpfCutoff: 100 + 500 - exponentialScale(data.value, data.min, data.max, 100, 500),

            brfLevel: data.filter == 'BR' ? 1 : 0,
            brfCutoff: 100 + 800 - exponentialScale(data.value, data.min, data.max, 100, 800),

            filterLag: Math.abs(100 + 500 - exponentialScale(data.value, data.min, data.max, 100, 500) - prevFreq) > 4000 ? 1 : 0.01,
            mixedSoundLevel: data.filter == 'Off' ? 1 : 0,

            // Echo
            delayTime: exponentialScale(data.value, data.min, data.max, 1.01, 1.5) - 1,
            decay: linearScale(data.value, data.min, data.max, 1.3, 1.75) - 1,
            delayLevel: data.echo ? 1 : 0,

            reverbMix: data.reverb ? exponentialScale(data.value, data.min, data.max, 1, 1.5) - 1 : 0.1,
            reverberation: data.reverb ? exponentialScale(data.value, data.min, data.max, 1.5, 2) - 1 : 0.5,

            t_trig: 1,
            gate: 1,
        })

        prevFreq = 100 + 500 - exponentialScale(data.value, data.min, data.max, 100, 500)
        if (data.filter == 'BR') prevFreq = 100 + 800 - exponentialScale(data.value, data.min, data.max, 100, 800)

        res.json('Success') // Send back the value (to not crash)
    })
})