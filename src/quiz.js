// ---------- Post-training quiz (staging only) ----------
// Source: "12 Post-Training Quizzes DRAFT" (Foundation Training 15 to 17 Oct 2026). English is the draft text.
// Hindi and Marathi were translated for this page and need review by a native speaker before wide use.
// Rules: one attempt per phone number per quiz, timed, answers locked once chosen, the right answer and
// the "why" are only sent after an answer is saved. Attempts are stored in the Airtable table Quiz Attempts.

const QUIZ_MINUTES = 15;
const QUIZ_TRAINER_WA = '919167954430';
const QA = { table: 'tblcpS9xrANciDtX3', title: 'flddA6DbDLq4uFUbN', name: 'flddhZkbDazlbfXj0', phone: 'fldUgyatJUUzzXZZh', quiz: 'fld7eGC76O3J27Rna',
  lang: 'fldsNoVDncBxfJSb7', status: 'fldezGeH8ZpR8db81', started: 'fldNytmuEeH4531ue', finished: 'fldMbMed8Qd9a3oiX', score: 'fldId9N8406tucnEu',
  outOf: 'fldSep8K62wOugR8k', starMissed: 'fld4n9uPmFFppmROQ', needsCall: 'fldXUhDgDEAS4mSJQ', answers: 'fldfZkAbJVV9z6uLR', data: 'fldADZQqxH1XVpoQF', key: 'fldmnvl2YAp3hJDeg' };
const QUIZ_LANGS = { en: 'English', hi: 'Hindi', mr: 'Marathi' };

// Each question: star (safety critical), ans (0 to 3, index into the English option order), src, and text per language.
const QUIZZES = {
  1: {
    name: 'Quiz 1: Keeping People Safe',
    title: { en: 'Quiz 1: Keeping People Safe', hi: 'क्विज़ 1: लोगों को सुरक्षित रखना', mr: 'क्विझ 1: लोकांना सुरक्षित ठेवणे' },
    read: { en: 'Read Modules 5, 6, 7 and 16 first.', hi: 'पहले मॉड्यूल 5, 6, 7 और 16 पढ़ें।', mr: 'आधी मॉड्यूल 5, 6, 7 आणि 16 वाचा.' },
    task: {
      en: 'Send your trainer a 1-minute voice note: "The Rock & Anchor emergency number is ____. The ambulance number is ____. On my next trek, before we start, I will ____."',
      hi: 'अपने ट्रेनर को 1 मिनट का वॉइस नोट भेजें: "Rock & Anchor का इमरजेंसी नंबर ____ है। एम्बुलेंस का नंबर ____ है। अगले ट्रेक पर, शुरू करने से पहले, मैं ____ करूँगा/करूँगी।"',
      mr: 'तुमच्या ट्रेनरला 1 मिनिटाची व्हॉइस नोट पाठवा: "Rock & Anchor चा इमर्जन्सी नंबर ____ आहे. ॲम्ब्युलन्सचा नंबर ____ आहे. पुढच्या ट्रेकवर, सुरुवात करण्यापूर्वी, मी ____ करेन."',
    },
    qs: [
      { star: 1, ans: 1, src: '5.3',
        en: { q: 'You see lightning and count 20 seconds before you hear thunder. What does this mean?', o: ['The storm is 20 km away. There is time to reach the summit.', 'The storm is about 4 km away. Act immediately.', 'The storm is about 10 km away. Keep watching.', 'Thunder does not tell you anything about distance.'], why: 'Divide the seconds by 5 to get the distance in km. 20 ÷ 5 = 4 km. Under 6 km (under 30 seconds) means act immediately.' },
        hi: { q: 'आपको बिजली दिखती है और गड़गड़ाहट सुनाई देने तक आप 20 सेकंड गिनते हैं। इसका क्या मतलब है?', o: ['तूफ़ान 20 किमी दूर है। चोटी तक पहुँचने का समय है।', 'तूफ़ान लगभग 4 किमी दूर है। तुरंत कदम उठाएँ।', 'तूफ़ान लगभग 10 किमी दूर है। नज़र रखते रहें।', 'गड़गड़ाहट से दूरी के बारे में कुछ पता नहीं चलता।'], why: 'सेकंड को 5 से भाग दें, तो दूरी किमी में मिलती है। 20 ÷ 5 = 4 किमी। 6 किमी से कम (30 सेकंड से कम) का मतलब है तुरंत कदम उठाएँ।' },
        mr: { q: 'तुम्हाला वीज दिसते आणि गडगडाट ऐकू येईपर्यंत तुम्ही 20 सेकंद मोजता. याचा अर्थ काय?', o: ['वादळ 20 किमी दूर आहे. शिखरावर पोहोचायला वेळ आहे.', 'वादळ सुमारे 4 किमी दूर आहे. लगेच कृती करा.', 'वादळ सुमारे 10 किमी दूर आहे. लक्ष ठेवत राहा.', 'गडगडाटावरून अंतराबद्दल काहीच कळत नाही.'], why: 'सेकंदांना 5 ने भागा, म्हणजे अंतर किमीमध्ये मिळते. 20 ÷ 5 = 4 किमी. 6 किमीपेक्षा कमी (30 सेकंदांपेक्षा कमी) म्हणजे लगेच कृती करा.' } },
      { star: 1, ans: 2, src: '5.3',
        en: { q: 'The group is caught on open ground in a lightning storm. What body position does the manual teach?', o: ['Lie flat on the ground.', 'Stand still under the nearest tall tree.', 'Crouch low, feet together, weight on the balls of the feet, hands on knees, head down.', 'Sit down and lean against a rock overhang.'], why: 'Lying flat increases contact with the ground. Lone trees and overhangs carry ground current.' },
        hi: { q: 'खुले मैदान में ग्रुप बिजली वाले तूफ़ान में फँस गया है। मैनुअल शरीर की कौन-सी स्थिति सिखाता है?', o: ['ज़मीन पर सीधे लेट जाएँ।', 'सबसे पास के ऊँचे पेड़ के नीचे स्थिर खड़े रहें।', 'नीचे झुककर बैठें, पैर आपस में मिलाकर, वज़न पंजों पर, हाथ घुटनों पर, सिर नीचे।', 'बैठ जाएँ और चट्टान के छज्जे के नीचे टिक जाएँ।'], why: 'लेटने से ज़मीन से संपर्क बढ़ता है। अकेले पेड़ और चट्टान के छज्जे ज़मीन का करंट ले आते हैं।' },
        mr: { q: 'मोकळ्या जागेवर ग्रुप विजेच्या वादळात अडकला आहे. मॅन्युअल शरीराची कोणती स्थिती शिकवते?', o: ['जमिनीवर सरळ झोपा.', 'जवळच्या उंच झाडाखाली स्थिर उभे राहा.', 'खाली वाकून बसा, पाय एकमेकांना जुळवून, वजन पायाच्या चवड्यांवर, हात गुडघ्यांवर, डोके खाली.', 'खाली बसा आणि खडकाच्या छज्ज्याखाली टेकून बसा.'], why: 'झोपल्याने जमिनीशी संपर्क वाढतो. एकटे झाड आणि खडकाचे छज्जे जमिनीतील करंट वाहून आणतात.' } },
      { star: 0, ans: 1, src: '5.3',
        en: { q: 'When the group moves off a ridge during lightning, how far apart should people spread out, and why?', o: ['2 metres, so nobody gets lost.', 'At least 10 metres, so one strike cannot injure several people.', 'Stay close together, so the leader can count everyone.', 'Distance does not matter.'], why: 'Spreading out prevents multiple casualties from one strike.' },
        hi: { q: 'बिजली के समय जब ग्रुप पहाड़ की धार से नीचे उतरता है, तो लोगों को एक-दूसरे से कितनी दूरी पर फैलना चाहिए, और क्यों?', o: ['2 मीटर, ताकि कोई खो न जाए।', 'कम से कम 10 मीटर, ताकि एक बार बिजली गिरने से कई लोग घायल न हों।', 'पास-पास रहें, ताकि लीडर सबको गिन सके।', 'दूरी से कोई फ़र्क नहीं पड़ता।'], why: 'फैलकर चलने से एक ही बिजली से कई लोग घायल नहीं होते।' },
        mr: { q: 'विजा चमकत असताना ग्रुप धारेवरून खाली उतरतो, तेव्हा लोकांनी एकमेकांपासून किती अंतर ठेवावे, आणि का?', o: ['2 मीटर, म्हणजे कोणी हरवणार नाही.', 'किमान 10 मीटर, म्हणजे एकदा वीज पडल्याने अनेक लोक जखमी होणार नाहीत.', 'जवळजवळ राहा, म्हणजे लीडर सगळ्यांना मोजू शकेल.', 'अंतराने काही फरक पडत नाही.'], why: 'पसरून चालल्याने एकाच विजेमुळे अनेक जण जखमी होत नाहीत.' } },
      { star: 0, ans: 2, src: '5.3',
        en: { q: 'After the last thunder, how long do you wait before moving on exposed ground again?', o: ['5 minutes', '10 minutes', '30 full minutes', 'Until the rain stops'], why: '' },
        hi: { q: 'आख़िरी गड़गड़ाहट के बाद, खुली जगह पर फिर से चलने से पहले कितनी देर रुकते हैं?', o: ['5 मिनट', '10 मिनट', 'पूरे 30 मिनट', 'बारिश रुकने तक'], why: '' },
        mr: { q: 'शेवटच्या गडगडाटानंतर, मोकळ्या जागेवर पुन्हा चालायला सुरुवात करण्यापूर्वी किती वेळ थांबता?', o: ['5 मिनिटे', '10 मिनिटे', 'पूर्ण 30 मिनिटे', 'पाऊस थांबेपर्यंत'], why: '' } },
      { star: 0, ans: 1, src: '5.2',
        en: { q: 'What is the number one cause of injuries on Sahyadri treks?', o: ['Snake bites', 'Slippery basalt rock', 'Heat', 'Getting lost'], why: 'Stop the group before the section, point out the hazard, show foot placement, and walk beside unsteady participants.' },
        hi: { q: 'सह्याद्री ट्रेक पर चोट लगने का सबसे बड़ा कारण क्या है?', o: ['साँप का काटना', 'फिसलन वाली बेसाल्ट चट्टान', 'गर्मी', 'रास्ता भटक जाना'], why: 'उस हिस्से से पहले ग्रुप को रोकें, ख़तरा दिखाएँ, पैर कहाँ रखना है यह दिखाएँ, और जो लड़खड़ा रहे हैं उनके साथ-साथ चलें।' },
        mr: { q: 'सह्याद्रीतील ट्रेकवर दुखापत होण्याचे सगळ्यात मोठे कारण कोणते?', o: ['साप चावणे', 'निसरडा बेसाल्ट खडक', 'उष्णता', 'रस्ता चुकणे'], why: 'त्या भागाच्या आधी ग्रुप थांबवा, धोका दाखवा, पाय कुठे ठेवायचा ते दाखवा, आणि जे डगमगत आहेत त्यांच्या बाजूने चाला.' } },
      { star: 1, ans: 1, src: '5.4, 5.5, Scenario 9; Participant Handbook section 4',
        en: { q: 'You are at the back of the group as sweep. Dark clouds are building and you hear thunder. The Leader at the front has not noticed. What do you do?', o: ['Turn the group around yourself.', "Get the Leader's attention at once, tell them clearly what you heard and saw, then support the Leader's decision.", 'Wait and see if it gets worse.', 'Ask the group whether they want to continue.'], why: 'As a Co-Leader you notice early, speak up and support the decision. The turn-back decision is never a group vote.' },
        hi: { q: 'आप ग्रुप के सबसे पीछे स्वीप हैं। काले बादल घिर रहे हैं और आपको गड़गड़ाहट सुनाई देती है। आगे चल रहे लीडर ने ध्यान नहीं दिया है। आप क्या करेंगे?', o: ['खुद ही ग्रुप को वापस मोड़ दें।', 'तुरंत लीडर का ध्यान खींचें, साफ़-साफ़ बताएँ कि आपने क्या सुना और देखा, फिर लीडर के फ़ैसले का साथ दें।', 'रुककर देखें कि हालात और बिगड़ते हैं या नहीं।', 'ग्रुप से पूछें कि वे आगे जाना चाहते हैं या नहीं।'], why: 'को-लीडर के रूप में आप जल्दी नोटिस करते हैं, बोलते हैं और फ़ैसले का साथ देते हैं। वापस लौटने का फ़ैसला कभी भी ग्रुप की वोटिंग से नहीं होता।' },
        mr: { q: 'तुम्ही ग्रुपच्या सगळ्यात मागे स्वीप आहात. काळे ढग जमत आहेत आणि तुम्हाला गडगडाट ऐकू येतो. पुढे असलेल्या लीडरच्या लक्षात आलेले नाही. तुम्ही काय कराल?', o: ['स्वतःच ग्रुपला मागे वळवा.', 'लगेच लीडरचे लक्ष वेधा, तुम्ही काय ऐकले आणि पाहिले ते स्पष्ट सांगा, मग लीडरच्या निर्णयाला साथ द्या.', 'थांबून बघा, परिस्थिती आणखी बिघडते का.', 'ग्रुपला विचारा की त्यांना पुढे जायचे आहे का.'], why: 'को-लीडर म्हणून तुम्ही लवकर लक्षात घेता, बोलता आणि निर्णयाला साथ देता. मागे फिरण्याचा निर्णय कधीही ग्रुपच्या मतदानाने होत नाही.' } },
      { star: 1, ans: 2, src: '6.3, 2.3',
        en: { q: 'At a waterfall, what do two whistle blasts mean?', o: ['Someone is lost.', 'Lunch is ready.', 'Everyone out of the water immediately.', 'Swim to the rope.'], why: 'Do not confuse this with three blasts, which means "I am separated, I have stopped, I am waiting."' },
        hi: { q: 'झरने पर, सीटी की दो आवाज़ों का क्या मतलब है?', o: ['कोई खो गया है।', 'खाना तैयार है।', 'सब लोग तुरंत पानी से बाहर निकलें।', 'रस्सी की ओर तैरें।'], why: 'इसे तीन सीटी से न मिलाएँ। तीन सीटी का मतलब है "मैं अलग हो गया हूँ, मैं रुक गया हूँ, मैं इंतज़ार कर रहा हूँ।"' },
        mr: { q: 'धबधब्यावर शिट्टीच्या दोन आवाजांचा अर्थ काय?', o: ['कोणी हरवले आहे.', 'जेवण तयार आहे.', 'सगळ्यांनी लगेच पाण्याबाहेर या.', 'दोरीकडे पोहत जा.'], why: 'हे तीन शिट्ट्यांशी गोंधळू नका. तीन शिट्ट्या म्हणजे "मी वेगळा झालो आहे, मी थांबलो आहे, मी वाट पाहत आहे."' } },
      { star: 1, ans: 1, src: '6.3',
        en: { q: 'During swimming, what does raising one arm mean?', o: ['"I want to take a photo."', '"The current is pulling me."', '"I am getting out."', '"I am cold."'], why: '' },
        hi: { q: 'तैरते समय एक हाथ ऊपर उठाने का क्या मतलब है?', o: ['"मुझे फ़ोटो लेनी है।"', '"पानी का बहाव मुझे खींच रहा है।"', '"मैं बाहर निकल रहा हूँ।"', '"मुझे ठंड लग रही है।"'], why: '' },
        mr: { q: 'पोहताना एक हात वर करण्याचा अर्थ काय?', o: ['"मला फोटो काढायचा आहे."', '"पाण्याचा प्रवाह मला ओढत आहे."', '"मी बाहेर येत आहे."', '"मला थंडी वाजत आहे."'], why: '' } },
      { star: 1, ans: 2, src: '6.1, 6.2',
        en: { q: 'During the site check, you cannot clearly see the bottom of the pool. What is the rule?', o: ['Diving is fine if people are careful.', 'Only strong swimmers may jump.', 'No diving and no jumping. Period.', 'Jump only from low rocks.'], why: 'Underwater rocks are invisible from the surface.' },
        hi: { q: 'जगह की जाँच के दौरान आपको पानी के कुंड का तल साफ़ नहीं दिखता। नियम क्या है?', o: ['सावधानी रखें तो डाइव करना ठीक है।', 'सिर्फ़ अच्छे तैराक कूद सकते हैं।', 'न डाइविंग, न कूदना। बस।', 'सिर्फ़ नीची चट्टानों से कूदें।'], why: 'पानी के अंदर की चट्टानें ऊपर से दिखाई नहीं देतीं।' },
        mr: { q: 'जागेची तपासणी करताना तुम्हाला डोहाचा तळ स्पष्ट दिसत नाही. नियम काय आहे?', o: ['काळजी घेतली तर डाइव्ह करणे ठीक आहे.', 'फक्त चांगले पोहणारे उडी मारू शकतात.', 'डाइव्ह नाही आणि उडी नाही. बस्स.', 'फक्त कमी उंचीच्या खडकांवरून उडी मारा.'], why: 'पाण्याखालचे खडक वरून दिसत नाहीत.' } },
      { star: 0, ans: 1, src: '6.1',
        en: { q: 'In monsoon, how fast can the water level at a waterfall change?', o: ['Over a few days', 'In 10 to 15 minutes', 'Only overnight', 'It does not change during the day'], why: '' },
        hi: { q: 'मानसून में, झरने पर पानी का स्तर कितनी जल्दी बदल सकता है?', o: ['कुछ दिनों में', '10 से 15 मिनट में', 'सिर्फ़ रात भर में', 'दिन में नहीं बदलता'], why: '' },
        mr: { q: 'पावसाळ्यात धबधब्यावरील पाण्याची पातळी किती लवकर बदलू शकते?', o: ['काही दिवसांत', '10 ते 15 मिनिटांत', 'फक्त रात्रभरात', 'दिवसा बदलत नाही'], why: '' } },
      { star: 0, ans: 1, src: '6.1, 6.3, review question 34',
        en: { q: 'A participant says, "The water looks fine, I am a strong swimmer." What is the best response?', o: ['"Okay, you can go past the rope."', '"The surface looks calm, but near the waterfall the current is not. The safe area is the same for everyone today."', 'Say nothing and let them decide.', '"Ask the other participants."'], why: 'Swimmers overestimate their ability in moving water. A calm surface can hide a dangerous pull. If they keep pushing, bring in the Leader.' },
        hi: { q: 'एक प्रतिभागी कहता है, "पानी ठीक लग रहा है, मैं अच्छा तैराक हूँ।" सबसे अच्छा जवाब क्या है?', o: ['"ठीक है, आप रस्सी के आगे जा सकते हैं।"', '"ऊपर से पानी शांत दिखता है, लेकिन झरने के पास बहाव तेज़ है। आज सुरक्षित जगह सबके लिए एक ही है।"', 'कुछ न कहें और उन्हें खुद फ़ैसला करने दें।', '"बाकी प्रतिभागियों से पूछ लीजिए।"'], why: 'तैराक बहते पानी में अपनी क्षमता को ज़्यादा आँकते हैं। शांत सतह के नीचे ख़तरनाक खिंचाव छिपा हो सकता है। अगर वे ज़िद करें, तो लीडर को बुलाएँ।' },
        mr: { q: 'एक सहभागी म्हणतो, "पाणी ठीक दिसतंय, मी चांगला पोहणारा आहे." सगळ्यात चांगले उत्तर कोणते?', o: ['"ठीक आहे, तुम्ही दोरीच्या पुढे जाऊ शकता."', '"वरून पाणी शांत दिसतं, पण धबधब्याजवळ प्रवाह जोरात आहे. आज सुरक्षित जागा सगळ्यांसाठी एकच आहे."', 'काहीही बोलू नका, त्यांना ठरवू द्या.', '"इतर सहभागींना विचारा."'], why: 'पोहणारे वाहत्या पाण्यात स्वतःची क्षमता जास्त समजतात. शांत पृष्ठभागाखाली धोकादायक ओढ लपलेली असू शकते. ते हट्ट करत राहिले तर लीडरला बोलवा.' } },
      { star: 1, ans: 2, src: '7.4',
        en: { q: 'A participant has a deep cut. The cloth you are pressing on it is soaking through with blood. What do you do?', o: ['Lift the cloth to look at the wound.', 'Remove the cloth and put on a fresh one.', 'Keep firm pressure, add more cloth on top without lifting, and raise the limb.', 'Wash it with stream water and wait.'], why: 'Firm direct pressure for 10 to 15 minutes. Lifting the cloth restarts the bleeding. If it will not stop, it needs evacuation.' },
        hi: { q: 'एक प्रतिभागी को गहरा कट लगा है। जिस कपड़े से आप दबा रहे हैं, वह ख़ून से भीग रहा है। आप क्या करेंगे?', o: ['घाव देखने के लिए कपड़ा उठाएँ।', 'कपड़ा हटाकर नया कपड़ा लगाएँ।', 'मज़बूती से दबाए रखें, कपड़ा उठाए बिना ऊपर और कपड़ा रखें, और हाथ या पैर को ऊपर उठाएँ।', 'नाले के पानी से धोएँ और इंतज़ार करें।'], why: '10 से 15 मिनट तक सीधा, मज़बूत दबाव। कपड़ा उठाने से ख़ून फिर से बहने लगता है। अगर ख़ून न रुके, तो मरीज़ को बाहर ले जाना (इवैक्युएशन) ज़रूरी है।' },
        mr: { q: 'एका सहभागीला खोल जखम झाली आहे. तुम्ही ज्या कापडाने दाबत आहात ते रक्ताने भिजत आहे. तुम्ही काय कराल?', o: ['जखम पाहण्यासाठी कापड उचला.', 'कापड काढून नवीन कापड लावा.', 'घट्ट दाब कायम ठेवा, कापड न उचलता वर आणखी कापड ठेवा, आणि हात किंवा पाय वर उचला.', 'ओढ्याच्या पाण्याने धुवा आणि वाट पाहा.'], why: '10 ते 15 मिनिटे थेट, घट्ट दाब. कापड उचलल्याने रक्त पुन्हा वाहू लागते. रक्त थांबत नसेल तर रुग्णाला बाहेर नेणे (इव्हॅक्युएशन) आवश्यक आहे.' } },
      { star: 1, ans: 2, src: '7.7, 5.2',
        en: { q: 'Which of these needs IMMEDIATE evacuation?', o: ['High fever', 'Persistent vomiting', 'Snake bite', 'Cannot walk because of an ankle injury'], why: 'The other three are "evacuate soon". Snake bite is immediate: keep the person still, note the time, evacuate.' },
        hi: { q: 'इनमें से किसमें तुरंत इवैक्युएशन (मरीज़ को बाहर ले जाना) ज़रूरी है?', o: ['तेज़ बुख़ार', 'लगातार उल्टी', 'साँप का काटना', 'टखने की चोट के कारण चल नहीं पा रहा'], why: 'बाकी तीन में "जल्द बाहर ले जाएँ"। साँप के काटने पर तुरंत: व्यक्ति को स्थिर रखें, समय नोट करें, बाहर ले जाएँ।' },
        mr: { q: 'यापैकी कशासाठी लगेच इव्हॅक्युएशन (रुग्णाला बाहेर नेणे) आवश्यक आहे?', o: ['जास्त ताप', 'सतत उलट्या', 'साप चावणे', 'घोट्याच्या दुखापतीमुळे चालता येत नाही'], why: 'बाकीच्या तिन्हींसाठी "लवकर बाहेर न्या". साप चावल्यास लगेच: व्यक्तीला स्थिर ठेवा, वेळ नोंदवा, बाहेर न्या.' } },
      { star: 1, ans: 1, src: 'Module 16, 7.7',
        en: { q: 'Someone is seriously injured and there is no phone signal. What do you do?', o: ['Send the fastest person alone to find signal.', 'Send two people together toward signal, with a written note of the location, the condition and what has been done.', 'Everyone walks out together and leaves the patient to rest.', 'Wait for signal to come back.'], why: 'Never send one person alone. Never leave the patient alone.' },
        hi: { q: 'कोई गंभीर रूप से घायल है और फ़ोन में नेटवर्क नहीं है। आप क्या करेंगे?', o: ['सबसे तेज़ व्यक्ति को अकेले नेटवर्क ढूँढने भेजें।', 'दो लोगों को साथ में नेटवर्क की ओर भेजें, जगह, हालत और अब तक क्या किया गया, यह लिखकर दें।', 'सब लोग साथ में बाहर चले जाएँ और मरीज़ को आराम करने दें।', 'नेटवर्क वापस आने का इंतज़ार करें।'], why: 'कभी किसी एक व्यक्ति को अकेले न भेजें। कभी मरीज़ को अकेला न छोड़ें।' },
        mr: { q: 'कोणीतरी गंभीर जखमी आहे आणि फोनला नेटवर्क नाही. तुम्ही काय कराल?', o: ['सगळ्यात वेगवान व्यक्तीला एकट्याला नेटवर्क शोधायला पाठवा.', 'दोन लोकांना एकत्र नेटवर्कच्या दिशेने पाठवा, जागा, स्थिती आणि आतापर्यंत काय केले ते लिहून द्या.', 'सगळे एकत्र बाहेर निघा आणि रुग्णाला आराम करू द्या.', 'नेटवर्क परत येण्याची वाट पाहा.'], why: 'कधीही एका व्यक्तीला एकटे पाठवू नका. कधीही रुग्णाला एकटे सोडू नका.' } },
      { star: 1, ans: 1, src: 'Module 16, Emergency Response Sequence step 1',
        en: { q: 'You reach an injured person. What is the very first step?', o: ['Call 108.', 'Make sure the scene is safe before you approach.', 'Give them water.', 'Take a photo for the report.'], why: 'If the scene is not safe, there can soon be two patients.' },
        hi: { q: 'आप एक घायल व्यक्ति तक पहुँचते हैं। सबसे पहला कदम क्या है?', o: ['108 पर कॉल करें।', 'पास जाने से पहले पक्का करें कि जगह सुरक्षित है।', 'उन्हें पानी दें।', 'रिपोर्ट के लिए फ़ोटो लें।'], why: 'अगर जगह सुरक्षित नहीं है, तो जल्द ही दो मरीज़ हो सकते हैं।' },
        mr: { q: 'तुम्ही एका जखमी व्यक्तीपर्यंत पोहोचता. सगळ्यात पहिले पाऊल कोणते?', o: ['108 वर कॉल करा.', 'जवळ जाण्यापूर्वी जागा सुरक्षित आहे याची खात्री करा.', 'त्यांना पाणी द्या.', 'रिपोर्टसाठी फोटो काढा.'], why: 'जागा सुरक्षित नसेल तर लवकरच दोन रुग्ण होऊ शकतात.' } },
    ],
  },
  2: {
    name: 'Quiz 2: Leading the Experience',
    title: { en: 'Quiz 2: Leading the Experience', hi: 'क्विज़ 2: अनुभव का नेतृत्व करना', mr: 'क्विझ 2: अनुभवाचे नेतृत्व करणे' },
    read: { en: 'Read Modules 2, 4, 8 and 12 first.', hi: 'पहले मॉड्यूल 2, 4, 8 और 12 पढ़ें।', mr: 'आधी मॉड्यूल 2, 4, 8 आणि 12 वाचा.' },
    task: {
      en: 'Teach one Leave No Trace principle to someone at home or in your village: a child, a parent, a friend. Then send your trainer a voice note or photo: who you taught, which principle, and what they said back.',
      hi: 'घर या गाँव में किसी को एक Leave No Trace नियम सिखाएँ: कोई बच्चा, माता-पिता, दोस्त। फिर अपने ट्रेनर को वॉइस नोट या फ़ोटो भेजें: आपने किसे सिखाया, कौन-सा नियम, और उन्होंने क्या जवाब दिया।',
      mr: 'घरी किंवा गावात कोणालातरी एक Leave No Trace नियम शिकवा: एखादे मूल, आई-वडील, मित्र. मग तुमच्या ट्रेनरला व्हॉइस नोट किंवा फोटो पाठवा: तुम्ही कोणाला शिकवले, कोणता नियम, आणि त्यांनी काय उत्तर दिले.',
    },
    qs: [
      { star: 0, ans: 2, src: '2.8',
        en: { q: 'Which of these is NOT one of the Rock & Anchor 10 Essentials?', o: ['Navigation', 'Emergency shelter', 'Trekking poles', 'Extra water'], why: '' },
        hi: { q: 'इनमें से कौन-सा Rock & Anchor की 10 ज़रूरी चीज़ों (10 Essentials) में नहीं है?', o: ['नेविगेशन (रास्ता पहचानना)', 'इमरजेंसी शेल्टर', 'ट्रेकिंग पोल (छड़ी)', 'अतिरिक्त पानी'], why: '' },
        mr: { q: 'यापैकी कोणती गोष्ट Rock & Anchor च्या 10 आवश्यक गोष्टींमध्ये (10 Essentials) नाही?', o: ['नेव्हिगेशन (रस्ता ओळखणे)', 'इमर्जन्सी शेल्टर', 'ट्रेकिंग पोल (काठी)', 'जादा पाणी'], why: '' } },
      { star: 0, ans: 2, src: '2.8 (Headlamp)',
        en: { q: 'The trek is in the daytime. Do you still need a headlamp?', o: ['No, it is daytime.', 'No, the phone flashlight is enough.', 'Yes. A delay or injury can turn a day trek into a night situation. The phone light is only a backup.', 'Only in monsoon.'], why: '' },
        hi: { q: 'ट्रेक दिन में है। क्या फिर भी हेडलैंप चाहिए?', o: ['नहीं, दिन है।', 'नहीं, फ़ोन की टॉर्च काफ़ी है।', 'हाँ। देरी या चोट से दिन का ट्रेक रात की स्थिति बन सकता है। फ़ोन की लाइट सिर्फ़ बैकअप है।', 'सिर्फ़ मानसून में।'], why: '' },
        mr: { q: 'ट्रेक दिवसा आहे. तरीही हेडलॅम्प लागतो का?', o: ['नाही, दिवस आहे.', 'नाही, फोनची टॉर्च पुरेशी आहे.', 'हो. उशीर किंवा दुखापत झाल्यास दिवसाचा ट्रेक रात्रीपर्यंत जाऊ शकतो. फोनचा लाइट फक्त बॅकअप आहे.', 'फक्त पावसाळ्यात.'], why: '' } },
      { star: 0, ans: 1, src: '2.2',
        en: { q: 'How early should the leader team arrive at the meeting point?', o: ['On time, with the participants', '15 minutes before participants', '2 hours before', 'It does not matter'], why: 'Use the time to review the day: key moments, risks and teaching opportunities.' },
        hi: { q: 'लीडर टीम को मिलने की जगह पर कितनी जल्दी पहुँचना चाहिए?', o: ['समय पर, प्रतिभागियों के साथ', 'प्रतिभागियों से 15 मिनट पहले', '2 घंटे पहले', 'कोई फ़र्क नहीं पड़ता'], why: 'इस समय में दिन की तैयारी दोहराएँ: ख़ास पल, ख़तरे और सिखाने के मौके।' },
        mr: { q: 'लीडर टीमने भेटण्याच्या ठिकाणी किती लवकर पोहोचावे?', o: ['वेळेवर, सहभागींसोबत', 'सहभागींच्या 15 मिनिटे आधी', '2 तास आधी', 'काही फरक पडत नाही'], why: 'या वेळेत दिवसाची उजळणी करा: महत्त्वाचे क्षण, धोके आणि शिकवण्याच्या संधी.' } },
      { star: 1, ans: 1, src: '2.4',
        en: { q: 'How often do you count the group on the trail?', o: ['Only at the start and the end', 'Every 20 to 30 minutes, quietly, while walking or at natural stops', 'Once every 2 hours', 'Only if someone seems missing'], why: '' },
        hi: { q: 'रास्ते में ग्रुप की गिनती कितनी बार करते हैं?', o: ['सिर्फ़ शुरुआत और आख़िर में', 'हर 20 से 30 मिनट में, चुपचाप, चलते हुए या जहाँ अपने-आप रुकते हैं वहाँ', 'हर 2 घंटे में एक बार', 'सिर्फ़ तब जब कोई गायब लगे'], why: '' },
        mr: { q: 'वाटेत ग्रुपची मोजणी किती वेळा करता?', o: ['फक्त सुरुवातीला आणि शेवटी', 'दर 20 ते 30 मिनिटांनी, शांतपणे, चालताना किंवा नैसर्गिक थांब्यांवर', 'दर 2 तासांनी एकदा', 'फक्त कोणी गायब वाटल्यास'], why: '' } },
      { star: 0, ans: 3, src: '2.4',
        en: { q: 'Whose speed sets the pace of the group?', o: ["The leader's", "The average person's", "The fastest person's", "The slowest person's. Always."], why: '' },
        hi: { q: 'ग्रुप की रफ़्तार किसकी चाल से तय होती है?', o: ['लीडर की', 'औसत व्यक्ति की', 'सबसे तेज़ व्यक्ति की', 'सबसे धीमे व्यक्ति की। हमेशा।'], why: '' },
        mr: { q: 'ग्रुपचा वेग कोणाच्या चालीवरून ठरतो?', o: ['लीडरच्या', 'सरासरी व्यक्तीच्या', 'सगळ्यात वेगवान व्यक्तीच्या', 'सगळ्यात हळू व्यक्तीच्या. नेहमी.'], why: '' } },
      { star: 1, ans: 2, src: '2.6',
        en: { q: 'When do most accidents happen?', o: ['At the start, when people are nervous', 'At the summit', 'On the way back, when people are tired and the trail feels familiar', 'At the meeting point'], why: 'Shorter steps, bent knees, slow controlled pace, extra attention to children and older participants.' },
        hi: { q: 'ज़्यादातर हादसे कब होते हैं?', o: ['शुरुआत में, जब लोग घबराए होते हैं', 'चोटी पर', 'वापसी में, जब लोग थके होते हैं और रास्ता जाना-पहचाना लगता है', 'मिलने की जगह पर'], why: 'छोटे कदम, घुटने थोड़े मुड़े हुए, धीमी और संभली हुई चाल, बच्चों और बुज़ुर्गों पर ज़्यादा ध्यान।' },
        mr: { q: 'बहुतेक अपघात कधी होतात?', o: ['सुरुवातीला, जेव्हा लोक घाबरलेले असतात', 'शिखरावर', 'परत येताना, जेव्हा लोक थकलेले असतात आणि रस्ता ओळखीचा वाटतो', 'भेटण्याच्या ठिकाणी'], why: 'लहान पावले, गुडघे थोडे वाकवलेले, हळू आणि नियंत्रित चाल, मुलांकडे आणि वयस्कांकडे जास्त लक्ष.' } },
      { star: 1, ans: 1, src: '2.5',
        en: { q: 'The group reaches the destination. What do you do first?', o: ['Take the group photo.', 'Count everyone.', 'Share the story of the place.', 'Let everyone explore.'], why: '' },
        hi: { q: 'ग्रुप मंज़िल पर पहुँचता है। आप सबसे पहले क्या करेंगे?', o: ['ग्रुप फ़ोटो लें।', 'सबकी गिनती करें।', 'जगह की कहानी सुनाएँ।', 'सबको घूमने दें।'], why: '' },
        mr: { q: 'ग्रुप ठिकाणी पोहोचतो. तुम्ही सगळ्यात आधी काय कराल?', o: ['ग्रुप फोटो काढा.', 'सगळ्यांची मोजणी करा.', 'त्या जागेची गोष्ट सांगा.', 'सगळ्यांना फिरू द्या.'], why: '' } },
      { star: 0, ans: 1, src: 'Module 4',
        en: { q: 'Which instruction follows AIRC best?', o: ['"Be careful near the water."', '"Everyone, stop here and look at me. Stop before the stream. One person crosses at a time. Wait for my signal. The rocks under the water are loose. Rahul, tell me: what do we do at the stream?"', '"Cross quickly, we are late."', '"Does everyone understand?"'], why: 'Attention, a specific Instruction, the Reason, and Confirmation from a named person.' },
        hi: { q: 'कौन-सा निर्देश AIRC का सबसे अच्छा पालन करता है?', o: ['"पानी के पास ध्यान रखना।"', '"सब लोग, यहाँ रुकिए और मेरी तरफ़ देखिए। नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा। मेरे इशारे का इंतज़ार करें। पानी के नीचे के पत्थर हिलते हैं। राहुल, बताओ: नाले पर हमें क्या करना है?"', '"जल्दी पार करो, हम लेट हैं।"', '"सबको समझ आया?"'], why: 'ध्यान (Attention), साफ़ निर्देश (Instruction), कारण (Reason), और नाम लेकर किसी एक से पुष्टि (Confirmation)।' },
        mr: { q: 'कोणती सूचना AIRC चे सगळ्यात चांगले पालन करते?', o: ['"पाण्याजवळ काळजी घ्या."', '"सगळे, इथे थांबा आणि माझ्याकडे पाहा. ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल. माझ्या इशाऱ्याची वाट पाहा. पाण्याखालचे दगड हलतात. राहुल, सांग: ओढ्यावर आपण काय करायचे?"', '"पटकन ओलांडा, आपल्याला उशीर झालाय."', '"सगळ्यांना समजले का?"'], why: 'लक्ष (Attention), स्पष्ट सूचना (Instruction), कारण (Reason), आणि नाव घेऊन एकाकडून खात्री (Confirmation).' } },
      { star: 0, ans: 1, src: 'Module 4 (Confirmation)',
        en: { q: 'What is the strongest way to confirm people understood?', o: ['"Is everyone OK?"', 'Ask one named person to tell you what to do next.', 'Repeat the instruction louder.', 'Assume that silence means yes.'], why: '' },
        hi: { q: 'लोगों को समझ आया या नहीं, यह पक्का करने का सबसे अच्छा तरीका क्या है?', o: ['"सब ठीक हैं?"', 'किसी एक व्यक्ति का नाम लेकर उससे पूछें कि आगे क्या करना है।', 'निर्देश ज़ोर से दोहराएँ।', 'मान लें कि चुप रहने का मतलब हाँ है।'], why: '' },
        mr: { q: 'लोकांना समजले की नाही याची खात्री करण्याचा सगळ्यात चांगला मार्ग कोणता?', o: ['"सगळे ठीक आहेत ना?"', 'एका व्यक्तीचे नाव घेऊन त्याला पुढे काय करायचे ते विचारा.', 'सूचना मोठ्याने पुन्हा सांगा.', 'गप्प राहणे म्हणजे हो, असे समजा.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 3, 8.4, 8.5',
        en: { q: 'A participant drops an orange peel and says, "It is biodegradable." What is the best response?', o: ['"Fine, it will rot."', '"Actually, can you grab that? Orange peels take about 2 years to break down here, and animals eat them and get sick. Everything goes in the bag."', 'Pick it up yourself without saying anything.', 'Tell them off in front of the group.'], why: 'Give the "why" before the rule. Educate, do not scold.' },
        hi: { q: 'एक प्रतिभागी संतरे का छिलका गिराता है और कहता है, "यह तो अपने-आप सड़ जाएगा।" सबसे अच्छा जवाब क्या है?', o: ['"ठीक है, सड़ जाएगा।"', '"ज़रा उसे उठा लेंगे? यहाँ संतरे का छिलका सड़ने में लगभग 2 साल लगते हैं, और जानवर उसे खाकर बीमार पड़ते हैं। सब कुछ थैली में जाता है।"', 'कुछ कहे बिना खुद उठा लें।', 'सबके सामने डाँटें।'], why: 'नियम से पहले "क्यों" बताएँ। समझाएँ, डाँटें नहीं।' },
        mr: { q: 'एक सहभागी संत्र्याची साल टाकतो आणि म्हणतो, "ती आपोआप कुजून जाईल." सगळ्यात चांगले उत्तर कोणते?', o: ['"ठीक आहे, कुजेल."', '"ती जरा उचलाल का? इथे संत्र्याची साल कुजायला सुमारे 2 वर्षे लागतात, आणि प्राणी ती खाऊन आजारी पडतात. सगळं पिशवीत जातं."', 'काहीही न बोलता स्वतः उचला.', 'सगळ्यांसमोर रागवा.'], why: 'नियमाच्या आधी "का" सांगा. समजावून सांगा, रागवू नका.' } },
      { star: 0, ans: 1, src: '8.3',
        en: { q: 'At a waterfall trek, which LNT practice is correct?', o: ['Soap is fine if it is herbal.', 'No soap or shampoo in the water. Human waste at least 60 metres from water. Carry out food waste.', 'Food scraps can go in the stream.', 'Toilet paper can be buried near the pool.'], why: '' },
        hi: { q: 'झरने वाले ट्रेक पर, कौन-सा LNT (Leave No Trace) तरीका सही है?', o: ['हर्बल हो तो साबुन ठीक है।', 'पानी में साबुन या शैंपू नहीं। शौच पानी से कम से कम 60 मीटर दूर। खाने का कचरा वापस ले जाएँ।', 'खाने का बचा हुआ नाले में डाल सकते हैं।', 'टॉयलेट पेपर कुंड के पास गाड़ सकते हैं।'], why: '' },
        mr: { q: 'धबधब्याच्या ट्रेकवर कोणती LNT (Leave No Trace) पद्धत बरोबर आहे?', o: ['हर्बल असेल तर साबण चालतो.', 'पाण्यात साबण किंवा शाम्पू नाही. शौच पाण्यापासून किमान 60 मीटर दूर. अन्नाचा कचरा परत घेऊन जा.', 'उरलेले अन्न ओढ्यात टाकू शकतो.', 'टॉयलेट पेपर डोहाजवळ पुरू शकतो.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 6',
        en: { q: 'Why must participants never feed the monkeys?', o: ['The food is expensive.', 'Feeding makes them take food aggressively and become dangerous.', 'Monkeys do not eat human food.', 'It is fine if the food is fruit.'], why: '' },
        hi: { q: 'प्रतिभागियों को बंदरों को कभी खाना क्यों नहीं खिलाना चाहिए?', o: ['खाना महँगा है।', 'खिलाने से वे झपटकर खाना छीनने लगते हैं और ख़तरनाक हो जाते हैं।', 'बंदर इंसानों का खाना नहीं खाते।', 'फल हो तो ठीक है।'], why: '' },
        mr: { q: 'सहभागींनी माकडांना कधीही खायला का देऊ नये?', o: ['खाणे महाग आहे.', 'खायला दिल्याने ते आक्रमकपणे अन्न हिसकावू लागतात आणि धोकादायक होतात.', 'माकडे माणसांचे अन्न खात नाहीत.', 'फळ असेल तर चालते.'], why: '' } },
      { star: 1, ans: 1, src: 'Scenario 1',
        en: { q: 'The group is 40 minutes from the summit, it is 2:30 PM, three people keep stopping, and it is dark at 6 PM. The fit participants tell you, "Come on, let us push for the top." As a Co-Leader, what do you do?', o: ['Agree with them and lead them up.', "Tell the fit participants it is the Leader's call, give the Leader your honest read of the timings and the tired participants, then back the Leader's decision fully.", 'Ask the whole group to vote.', 'Say "we are almost there" to keep everyone moving.'], why: '40 up + 30 at the top + 2 hours down = arriving after dark. The weakest member decides, and the strongest participants never decide for the group.' },
        hi: { q: 'ग्रुप चोटी से 40 मिनट दूर है, दोपहर के 2:30 बजे हैं, तीन लोग बार-बार रुक रहे हैं, और शाम 6 बजे अँधेरा हो जाता है। फ़िट प्रतिभागी आपसे कहते हैं, "चलो, ऊपर तक चलते हैं।" को-लीडर के रूप में आप क्या करेंगे?', o: ['उनसे सहमत होकर उन्हें ऊपर ले जाएँ।', 'फ़िट प्रतिभागियों को बताएँ कि फ़ैसला लीडर का है, लीडर को समय और थके हुए लोगों के बारे में अपनी सच्ची राय दें, फिर लीडर के फ़ैसले का पूरा साथ दें।', 'पूरे ग्रुप से वोट करवाएँ।', 'सबको चलाते रहने के लिए कहें "बस पहुँच ही गए"।'], why: '40 मिनट ऊपर + 30 मिनट चोटी पर + 2 घंटे नीचे = अँधेरे के बाद पहुँचना। सबसे कमज़ोर सदस्य से फ़ैसला तय होता है, और सबसे तेज़ लोग कभी ग्रुप के लिए फ़ैसला नहीं करते।' },
        mr: { q: 'ग्रुप शिखरापासून 40 मिनिटे दूर आहे, दुपारचे 2:30 वाजले आहेत, तीन लोक सतत थांबत आहेत, आणि संध्याकाळी 6 वाजता अंधार होतो. फिट सहभागी तुम्हाला म्हणतात, "चला, वरपर्यंत जाऊया." को-लीडर म्हणून तुम्ही काय कराल?', o: ['त्यांच्याशी सहमत होऊन त्यांना वर घेऊन जा.', 'फिट सहभागींना सांगा की निर्णय लीडरचा आहे, लीडरला वेळ आणि थकलेल्या लोकांबद्दल तुमचे प्रामाणिक मत सांगा, मग लीडरच्या निर्णयाला पूर्ण साथ द्या.', 'संपूर्ण ग्रुपचे मतदान घ्या.', 'सगळ्यांना चालत ठेवण्यासाठी म्हणा "आलोच आता".'], why: '40 मिनिटे वर + 30 मिनिटे शिखरावर + 2 तास खाली = अंधार पडल्यानंतर पोहोचणे. सगळ्यात कमकुवत सदस्यावरून निर्णय ठरतो, आणि सगळ्यात तगडे लोक कधीही ग्रुपसाठी निर्णय घेत नाहीत.' } },
      { star: 0, ans: 2, src: 'Scenario 2',
        en: { q: 'A 9-year-old sits on the trail crying and says he wants to go home. What do you do first?', o: ['Tell him the other children are not crying.', 'Pick him up and carry on walking.', 'Crouch down to his eye level, ask calmly what is wrong, and give water and a snack.', 'Ignore it and keep the group moving.'], why: 'Hunger, thirst, a blister or fear are the usual real causes.' },
        hi: { q: '9 साल का एक बच्चा रास्ते में बैठकर रो रहा है और कहता है कि उसे घर जाना है। आप सबसे पहले क्या करेंगे?', o: ['उससे कहें कि बाकी बच्चे तो नहीं रो रहे।', 'उसे गोद में उठाकर चलते रहें।', 'उसकी आँखों के बराबर नीचे बैठें, शांति से पूछें कि क्या हुआ, और पानी व कुछ खाने को दें।', 'अनदेखा करें और ग्रुप को चलाते रहें।'], why: 'भूख, प्यास, छाला या डर अक्सर असली कारण होते हैं।' },
        mr: { q: '9 वर्षांचा एक मुलगा वाटेत बसून रडत आहे आणि म्हणतो की त्याला घरी जायचे आहे. तुम्ही सगळ्यात आधी काय कराल?', o: ['त्याला सांगा की बाकीची मुले रडत नाहीत.', 'त्याला उचलून चालत राहा.', 'त्याच्या डोळ्यांच्या पातळीवर खाली बसा, शांतपणे विचारा काय झाले, आणि पाणी व खाऊ द्या.', 'दुर्लक्ष करा आणि ग्रुपला चालत ठेवा.'], why: 'भूक, तहान, फोड किंवा भीती ही नेहमीची खरी कारणे असतात.' } },
      { star: 0, ans: 2, src: 'Scenario 7',
        en: { q: 'Village women arrive at the lake to wash clothes while your group is swimming. Which of these is a mistake?', o: ['Greeting them respectfully: "Namaskar tai. Aap aaramse kaam karein."', 'Letting participants watch quietly without filling the silence.', 'Photographing the women without asking.', 'Asking afterwards, "What did that change for you?"'], why: 'Without consent, a real moment becomes a tourist performance.' },
        hi: { q: 'आपका ग्रुप तैर रहा है, तभी गाँव की महिलाएँ कपड़े धोने तालाब पर आती हैं। इनमें से कौन-सी बात ग़लती है?', o: ['उनका सम्मान से अभिवादन करना: "नमस्कार ताई। आप आराम से काम करें।"', 'प्रतिभागियों को चुपचाप देखने देना, ख़ामोशी को बातों से न भरना।', 'बिना पूछे महिलाओं की फ़ोटो लेना।', 'बाद में पूछना, "इससे आपके लिए क्या बदला?"'], why: 'बिना अनुमति के, एक असली पल पर्यटकों का तमाशा बन जाता है।' },
        mr: { q: 'तुमचा ग्रुप पोहत असताना गावातील महिला कपडे धुण्यासाठी तलावावर येतात. यापैकी कोणती गोष्ट चूक आहे?', o: ['त्यांना आदराने नमस्कार करणे: "नमस्कार ताई. तुम्ही निवांत काम करा."', 'सहभागींना शांतपणे पाहू देणे, शांतता बोलण्याने न भरणे.', 'न विचारता महिलांचे फोटो काढणे.', 'नंतर विचारणे, "यामुळे तुमच्यासाठी काय बदलले?"'], why: 'परवानगी नसेल तर खरा क्षण पर्यटकांसाठीचा तमाशा बनतो.' } },
    ],
  },
};

const QUIZ_UI = {
  en: { lang: 'English', title: 'Post-Training Quiz', sub: 'Foundation Training, 15 to 17 October 2026', chooseLang: 'Choose your language', name: 'Your name', phone: 'Your mobile number', phoneHint: '10 digits. This makes sure each person takes each quiz once.', chooseQuiz: 'Choose the quiz', rulesTitle: 'Before you start',
    rules: ['You have {min} minutes. The timer starts when you press Start and does not stop.', 'You can take this quiz only once. If the page closes, open the same link and enter the same number to continue.', 'Once you choose an answer, it is locked. You will then see why the right answer is right.', '★ marks a safety question. If you miss one, your trainer will call you and talk it through.', 'There is no trick in any question. Every answer is in your manual.'],
    start: 'Start the quiz', next: 'Next question', finish: 'See my result', timeLeft: 'Time left', qOf: 'Question {i} of {n}', right: 'Correct.', wrong: 'The right answer is {L}.', why: 'Why', source: 'Manual section', star: 'Safety question',
    doneTitle: 'Well done for finishing.', timedOut: 'Time is up.', score: 'You got {s} out of {n}.', starAll: 'You got every ★ safety question right.', starMissed: '★ safety questions to go over with your trainer: {list}. Your trainer will call you within 2 days.', learning: 'The score is for learning, not for ranking.',
    taskTitle: 'One more thing (not scored, required)', taskBtn: 'Send on WhatsApp', already: 'You have already taken this quiz. Here is your result.', resume: 'Welcome back. Your quiz is still running.', errName: 'Please enter your name.', errPhone: 'Please enter a 10-digit mobile number.', errQuiz: 'Please choose a quiz.', errNet: 'Could not connect. Check your internet and try again.', errSrv: 'The quiz could not be saved just now. Please tell your trainer, then try again.', retry: 'Try again', notAnswered: 'Not answered', thanks: 'Thank you. The people in the mountains with you are counting on you knowing this.', saving: 'Saving…', back: 'Back' },
  hi: { lang: 'हिंदी', title: 'ट्रेनिंग के बाद की क्विज़', sub: 'फ़ाउंडेशन ट्रेनिंग, 15 से 17 अक्टूबर 2026', chooseLang: 'अपनी भाषा चुनें', name: 'आपका नाम', phone: 'आपका मोबाइल नंबर', phoneHint: '10 अंक। इससे हर व्यक्ति हर क्विज़ एक ही बार देता है।', chooseQuiz: 'क्विज़ चुनें', rulesTitle: 'शुरू करने से पहले',
    rules: ['आपके पास {min} मिनट हैं। स्टार्ट दबाते ही टाइमर शुरू होगा और रुकेगा नहीं।', 'यह क्विज़ आप सिर्फ़ एक बार दे सकते हैं। अगर पेज बंद हो जाए, तो वही लिंक खोलें और वही नंबर डालकर आगे बढ़ें।', 'जवाब चुनते ही वह लॉक हो जाता है। फिर आपको दिखेगा कि सही जवाब सही क्यों है।', '★ का मतलब सुरक्षा वाला सवाल है। अगर कोई ग़लत हुआ, तो आपके ट्रेनर आपको कॉल करके उस पर बात करेंगे।', 'किसी सवाल में कोई चाल नहीं है। हर जवाब आपके मैनुअल में है।'],
    start: 'क्विज़ शुरू करें', next: 'अगला सवाल', finish: 'मेरा नतीजा देखें', timeLeft: 'बचा समय', qOf: 'सवाल {i} / {n}', right: 'सही।', wrong: 'सही जवाब {L} है।', why: 'क्यों', source: 'मैनुअल सेक्शन', star: 'सुरक्षा सवाल',
    doneTitle: 'क्विज़ पूरी करने के लिए शाबाश।', timedOut: 'समय पूरा हुआ।', score: 'आपके {n} में से {s} जवाब सही हैं।', starAll: 'आपने हर ★ सुरक्षा सवाल सही किया।', starMissed: '★ सुरक्षा सवाल जिन पर ट्रेनर से बात करनी है: {list}। आपके ट्रेनर 2 दिन के अंदर आपको कॉल करेंगे।', learning: 'यह स्कोर सीखने के लिए है, तुलना के लिए नहीं।',
    taskTitle: 'एक और काम (नंबर नहीं मिलेंगे, पर ज़रूरी है)', taskBtn: 'WhatsApp पर भेजें', already: 'आप यह क्विज़ पहले ही दे चुके हैं। यह रहा आपका नतीजा।', resume: 'फिर से स्वागत है। आपकी क्विज़ अभी चल रही है।', errName: 'कृपया अपना नाम लिखें।', errPhone: 'कृपया 10 अंकों का मोबाइल नंबर लिखें।', errQuiz: 'कृपया क्विज़ चुनें।', errNet: 'कनेक्ट नहीं हो पाया। इंटरनेट चेक करके फिर से कोशिश करें।', errSrv: 'अभी क्विज़ सेव नहीं हो पाई। कृपया अपने ट्रेनर को बताएँ, फिर से कोशिश करें।', retry: 'फिर से कोशिश करें', notAnswered: 'जवाब नहीं दिया', thanks: 'धन्यवाद। पहाड़ों में आपके साथ चलने वाले लोग इस भरोसे पर हैं कि आपको यह पता है।', saving: 'सेव हो रहा है…', back: 'वापस' },
  mr: { lang: 'मराठी', title: 'प्रशिक्षणानंतरची क्विझ', sub: 'फाउंडेशन ट्रेनिंग, 15 ते 17 ऑक्टोबर 2026', chooseLang: 'तुमची भाषा निवडा', name: 'तुमचे नाव', phone: 'तुमचा मोबाईल नंबर', phoneHint: '10 अंक. यामुळे प्रत्येक व्यक्ती प्रत्येक क्विझ एकदाच देते.', chooseQuiz: 'क्विझ निवडा', rulesTitle: 'सुरुवात करण्यापूर्वी',
    rules: ['तुमच्याकडे {min} मिनिटे आहेत. स्टार्ट दाबताच टायमर सुरू होईल आणि थांबणार नाही.', 'ही क्विझ तुम्ही फक्त एकदाच देऊ शकता. पेज बंद झाले तर तीच लिंक उघडा आणि तोच नंबर टाकून पुढे चालू ठेवा.', 'उत्तर निवडताच ते लॉक होते. मग तुम्हाला दिसेल की बरोबर उत्तर बरोबर का आहे.', '★ म्हणजे सुरक्षेचा प्रश्न. तो चुकला तर तुमचे ट्रेनर तुम्हाला कॉल करून त्यावर बोलतील.', 'कोणत्याही प्रश्नात फसवणूक नाही. प्रत्येक उत्तर तुमच्या मॅन्युअलमध्ये आहे.'],
    start: 'क्विझ सुरू करा', next: 'पुढचा प्रश्न', finish: 'माझा निकाल पाहा', timeLeft: 'उरलेला वेळ', qOf: 'प्रश्न {i} / {n}', right: 'बरोबर.', wrong: 'बरोबर उत्तर {L} आहे.', why: 'का', source: 'मॅन्युअल विभाग', star: 'सुरक्षेचा प्रश्न',
    doneTitle: 'क्विझ पूर्ण केल्याबद्दल शाब्बास.', timedOut: 'वेळ संपली.', score: 'तुमची {n} पैकी {s} उत्तरे बरोबर आहेत.', starAll: 'तुम्ही प्रत्येक ★ सुरक्षेचा प्रश्न बरोबर सोडवला.', starMissed: '★ सुरक्षेचे प्रश्न ज्यांवर ट्रेनरशी बोलायचे आहे: {list}. तुमचे ट्रेनर 2 दिवसांत तुम्हाला कॉल करतील.', learning: 'हा स्कोअर शिकण्यासाठी आहे, तुलना करण्यासाठी नाही.',
    taskTitle: 'अजून एक काम (गुण नाहीत, पण आवश्यक)', taskBtn: 'WhatsApp वर पाठवा', already: 'तुम्ही ही क्विझ आधीच दिली आहे. हा तुमचा निकाल.', resume: 'पुन्हा स्वागत. तुमची क्विझ अजून चालू आहे.', errName: 'कृपया तुमचे नाव लिहा.', errPhone: 'कृपया 10 अंकी मोबाईल नंबर लिहा.', errQuiz: 'कृपया क्विझ निवडा.', errNet: 'कनेक्ट होऊ शकले नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.', errSrv: 'आत्ता क्विझ सेव्ह होऊ शकली नाही. कृपया तुमच्या ट्रेनरला सांगा, मग पुन्हा प्रयत्न करा.', retry: 'पुन्हा प्रयत्न करा', notAnswered: 'उत्तर दिले नाही', thanks: 'धन्यवाद. डोंगरात तुमच्यासोबत असणारे लोक तुम्हाला हे माहीत असण्यावर अवलंबून आहेत.', saving: 'सेव्ह होत आहे…', back: 'मागे' },
};

// ---------- server ----------
const qjson = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
async function qat(env, method, path, body) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${QA.table}${path}`, { method, headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Airtable ${r.status} ${JSON.stringify(j.error || j).slice(0, 200)}`);
  return j;
}
const qrand = () => [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, '0')).join('');
function qstate(rec) {
  const f = rec.fields || {};
  let a = {}; try { a = JSON.parse(f[QA.data] || '{}'); } catch (e) { a = {}; }
  return { id: rec.id, key: f[QA.key], quiz: f[QA.quiz] === QUIZZES[2].name ? 2 : 1, started: Date.parse(f[QA.started]), status: f[QA.status] || 'In progress', a, name: f[QA.name] || '' };
}
function qreveal(quiz, n, lang) {
  const q = QUIZZES[quiz].qs[n]; const t = q[lang] || q.en;
  return { correct: q.ans, why: t.why || '', src: q.src };
}
function qresult(st) {
  const qs = QUIZZES[st.quiz].qs;
  let score = 0; const starMissed = [];
  qs.forEach((q, i) => { const x = st.a[i]; const ok = x && x.c === q.ans; if (ok) score++; else if (q.star) starMissed.push(i + 1); });
  return { score, outOf: qs.length, starMissed };
}
async function qfinish(env, st, status) {
  const res = qresult(st);
  const L = 'ABCD';
  const lines = QUIZZES[st.quiz].qs.map((q, i) => { const x = st.a[i]; return `${i + 1}${q.star ? ' ★' : ''}: ${x ? L[x.c] + (x.c === q.ans ? ' (right)' : ` (wrong, answer ${L[q.ans]})`) : `not answered (answer ${L[q.ans]})`}`; }).join('\n');
  await qat(env, 'PATCH', `/${st.id}`, { typecast: true, fields: { [QA.status]: status, [QA.finished]: new Date().toISOString(), [QA.score]: res.score, [QA.outOf]: res.outOf, [QA.starMissed]: res.starMissed.join(', '), [QA.needsCall]: res.starMissed.length > 0, [QA.answers]: lines } });
  st.status = status;
  return res;
}
function qpublic(st, lang) {
  const deadline = st.started + QUIZ_MINUTES * 60000;
  const answered = {};
  Object.keys(st.a).forEach((k) => { answered[k] = { c: st.a[k].c, ...qreveal(st.quiz, +k, lang) }; });
  return { id: st.id, key: st.key, quiz: st.quiz, status: st.status, now: Date.now(), deadline, answered, result: st.status === 'In progress' ? null : qresult(st) };
}
async function quizApi(request, env, path) {
  if (request.method !== 'POST') return qjson({ error: 'method' }, 405);
  let b; try { b = await request.json(); } catch (e) { return qjson({ error: 'bad json' }, 400); }
  const lang = QUIZ_LANGS[b.lang] ? b.lang : 'en';
  try {
    if (path === '/quiz/api/start') {
      const quiz = b.quiz === 2 ? 2 : b.quiz === 1 ? 1 : 0;
      const phone = String(b.phone || '').replace(/\D/g, '').slice(-10);
      const name = String(b.name || '').trim().slice(0, 80);
      if (!quiz || phone.length !== 10 || !name) return qjson({ error: 'input' }, 400);
      const formula = `AND({Phone}='${phone}',{Quiz}='${QUIZZES[quiz].name}')`;
      const found = await qat(env, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
      let st, fresh = false;
      if (found.records && found.records.length) {
        st = qstate(found.records[0]);
        if (st.status === 'In progress' && Date.now() > st.started + QUIZ_MINUTES * 60000 + 15000) await qfinish(env, st, 'Timed out');
      } else {
        const now = new Date().toISOString();
        const rec = await qat(env, 'POST', '?returnFieldsByFieldId=true', { typecast: true, fields: { [QA.title]: `${name} · Quiz ${quiz}`, [QA.name]: name, [QA.phone]: phone, [QA.quiz]: QUIZZES[quiz].name, [QA.lang]: QUIZ_LANGS[lang], [QA.status]: 'In progress', [QA.started]: now, [QA.outOf]: QUIZZES[quiz].qs.length, [QA.data]: '{}', [QA.key]: qrand() } });
        st = qstate(rec); fresh = true;
      }
      return qjson({ ...qpublic(st, lang), fresh });
    }
    if (path === '/quiz/api/answer' || path === '/quiz/api/finish') {
      if (!/^rec[A-Za-z0-9]{14}$/.test(String(b.id || ''))) return qjson({ error: 'id' }, 400);
      // The single-record endpoint returns fields by name, so look the record up through the list endpoint instead.
      const got = await qat(env, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(`RECORD_ID()='${b.id}'`)}`);
      const rec = got.records && got.records[0];
      if (!rec) return qjson({ error: 'id' }, 404);
      const st = qstate(rec);
      if (!st.key || st.key !== b.key) return qjson({ error: 'key' }, 403);
      const late = Date.now() > st.started + QUIZ_MINUTES * 60000 + 15000;
      if (st.status === 'In progress' && late) { await qfinish(env, st, 'Timed out'); return qjson(qpublic(st, lang)); }
      if (path === '/quiz/api/finish') {
        if (st.status === 'In progress') await qfinish(env, st, Object.keys(st.a).length >= QUIZZES[st.quiz].qs.length ? 'Finished' : 'Timed out');
        return qjson(qpublic(st, lang));
      }
      const n = Number(b.q), c = Number(b.choice);
      const total = QUIZZES[st.quiz].qs.length;
      if (!(n >= 0 && n < total) || !(c >= 0 && c < 4)) return qjson({ error: 'input' }, 400);
      if (st.status !== 'In progress') return qjson(qpublic(st, lang));
      if (!st.a[n]) {
        st.a[n] = { c, t: Date.now() };
        await qat(env, 'PATCH', `/${st.id}`, { typecast: true, fields: { [QA.data]: JSON.stringify(st.a), [QA.lang]: QUIZ_LANGS[lang] } });
        if (Object.keys(st.a).length >= total) await qfinish(env, st, 'Finished');
      }
      return qjson(qpublic(st, lang));
    }
    return qjson({ error: 'not found' }, 404);
  } catch (e) {
    return qjson({ error: 'server', detail: String(e.message || e).slice(0, 300) }, 502);
  }
}

function quizPage() {
  // Questions go to the page without answers, "why" lines or sources. Those come from the server after each answer.
  const pub = {};
  for (const k of [1, 2]) {
    const Q = QUIZZES[k];
    pub[k] = { title: Q.title, read: Q.read, task: Q.task, qs: Q.qs.map((q) => ({ star: q.star, en: { q: q.en.q, o: q.en.o }, hi: { q: q.hi.q, o: q.hi.o }, mr: { q: q.mr.q, o: q.mr.o } })) };
  }
  const json = JSON.stringify({ quizzes: pub, ui: QUIZ_UI, minutes: QUIZ_MINUTES, wa: QUIZ_TRAINER_WA }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Post-Training Quiz | Rock &amp; Anchor</title><link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#2c4535"><style>${QUIZ_CSS}</style></head><body>
<header class="qz-top"><img src="/logo.png" alt="Rock &amp; Anchor" width="44" height="36"><div class="qz-lang" id="qz-lang" role="group" aria-label="Language"></div></header>
<main id="qz" aria-live="polite"><noscript><p class="qz-card">Please open this page in Chrome with JavaScript turned on.</p></noscript></main>
<script type="application/json" id="qz-data">${json}</script><script>${QUIZ_JS}</script></body></html>`;
}

const QUIZ_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('qz-data').textContent),root=document.getElementById('qz'),langBar=document.getElementById('qz-lang');
var L='ABCD',lang=ls('qz-lang')||'',S=null,cur=0,timer=null,skew=0,busy=false,pick={name:'',phone:'',quiz:0},msg='',showLast=null;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function t(k,r){var s=(D.ui[lang||'en']||D.ui.en)[k];if(r)for(var x in r)s=s.split('{'+x+'}').join(r[x]);return s}
function Q(){return D.quizzes[S.quiz]}
function txt(q){return q[lang]||q.en}
// same shuffled answer order every time for this attempt (seeded by the attempt key)
function order(n){var seed=0,k=S.key+'|'+n;for(var i=0;i<k.length;i++)seed=(seed*31+k.charCodeAt(i))>>>0;var a=[0,1,2,3];for(var j=3;j>0;j--){seed=(seed*1103515245+12345)>>>0;var r=seed%(j+1);var tmp=a[j];a[j]=a[r];a[r]=tmp}return a}
function api(p,body){body.lang=lang||'en';return fetch('/quiz/api/'+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok){j=j||{};j.srv=1;throw j}return j})})}
function drawLang(){langBar.innerHTML=['en','hi','mr'].map(function(k){return '<button type="button" data-lang="'+k+'" class="'+(lang===k?'on':'')+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('');langBar.hidden=!lang}
function setLang(k){lang=k;ls('qz-lang',k);document.documentElement.lang=k==='en'?'en-IN':k;drawLang();render()}
function mmss(ms){ms=Math.max(0,ms);var s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function left(){return S.deadline-(Date.now()+skew)}
function tick(){var el=document.getElementById('qz-time');if(!S||S.status!=='In progress'){clearInterval(timer);timer=null;return}var ms=left();if(el){el.textContent=mmss(ms);el.parentNode.classList.toggle('low',ms<120000)}if(ms<=0){clearInterval(timer);timer=null;finish()}}
function startTimer(){if(!timer)timer=setInterval(tick,500);tick()}
function firstOpen(){var n=Q().qs.length;for(var i=0;i<n;i++)if(!S.answered[i])return i;return n}
function load(j){S=j;skew=j.now-Date.now();if(S.status==='In progress'){ls('qz-att',JSON.stringify({id:S.id,key:S.key,quiz:S.quiz,phone:pick.phone,name:pick.name}));cur=Math.min(firstOpen(),Q().qs.length-1);if(firstOpen()<Q().qs.length&&S.answered[cur])cur=firstOpen();startTimer()}else{ls('qz-att',null)}render()}
function render(){
  if(!lang){root.innerHTML='<section class="qz-card qz-pick"><p class="qz-k">Rock &amp; Anchor</p><h1>Choose your language<br><span lang="hi">अपनी भाषा चुनें</span><br><span lang="mr">तुमची भाषा निवडा</span></h1><div class="qz-langs">'+['en','hi','mr'].map(function(k){return '<button type="button" class="qz-big" data-lang="'+k+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('')+'</div></section>';return}
  if(!S){
    root.innerHTML='<section class="qz-card"><p class="qz-k">'+h(t('sub'))+'</p><h1>'+h(t('title'))+'</h1>'+(msg?'<p class="qz-err" role="alert">'+h(msg)+'</p>':'')+
    '<label class="qz-f"><span>'+h(t('name'))+'</span><input id="qz-name" autocomplete="name" value="'+h(pick.name)+'"></label>'+
    '<label class="qz-f"><span>'+h(t('phone'))+'</span><input id="qz-phone" type="tel" inputmode="numeric" maxlength="14" autocomplete="tel" value="'+h(pick.phone)+'"><small>'+h(t('phoneHint'))+'</small></label>'+
    '<p class="qz-f"><span>'+h(t('chooseQuiz'))+'</span></p><div class="qz-quizzes">'+[1,2].map(function(k){var z=D.quizzes[k];return '<button type="button" class="qz-quiz'+(pick.quiz===k?' on':'')+'" data-quiz="'+k+'"><b>'+h(z.title[lang])+'</b><span>'+h(z.read[lang])+'</span></button>'}).join('')+'</div>'+
    '<div class="qz-rules"><h2>'+h(t('rulesTitle'))+'</h2><ul>'+t('rules').map(function(r){return '<li>'+h(r.split('{min}').join(D.minutes))+'</li>'}).join('')+'</ul></div>'+
    '<button type="button" class="qz-btn" data-start'+(busy?' disabled':'')+'>'+h(busy?t('saving'):t('start'))+'</button></section>';return}
  if(S.status!=='In progress'&&showLast===null){renderResult();return}
  var qs=Q().qs,n=qs.length,q=qs[cur],tx=txt(q),ord=order(cur),ans=S.answered[cur];
  var head='<div class="qz-bar"><div class="qz-timer"><span>'+h(t('timeLeft'))+'</span><b id="qz-time">'+mmss(left())+'</b></div><div class="qz-prog"><span>'+h(t('qOf',{i:cur+1,n:n}))+'</span><div class="qz-track"><i style="width:'+Math.round(Object.keys(S.answered).length/n*100)+'%"></i></div></div></div>';
  var body='<section class="qz-card qz-q">'+(q.star?'<p class="qz-star">★ '+h(t('star'))+'</p>':'')+'<h2>'+h(tx.q)+'</h2><div class="qz-opts">'+ord.map(function(o,i){var cls='';if(ans){if(o===ans.correct)cls=' ok';else if(o===ans.c)cls=' bad';else cls=' dim'}return '<button type="button" class="qz-opt'+cls+'" data-o="'+o+'"'+(ans||busy?' disabled':'')+'><span class="qz-l">'+L[i]+'</span><span>'+h(tx.o[o])+'</span></button>'}).join('')+'</div>';
  if(ans){var dl=L[ord.indexOf(ans.correct)];body+='<div class="qz-why '+(ans.c===ans.correct?'ok':'bad')+'"><p class="qz-verdict">'+h(ans.c===ans.correct?t('right'):t('wrong',{L:dl}))+'</p>'+(ans.why?'<p><b>'+h(t('why'))+':</b> '+h(ans.why)+'</p>':'')+'<p class="qz-src">'+h(t('source'))+': '+h(ans.src)+'</p></div>';
    var more=firstOpen()<n;body+='<button type="button" class="qz-btn" '+(more?'data-next':'data-finish')+'>'+h(more?t('next'):t('finish'))+'</button>'}
  else if(busy)body+='<p class="qz-saving">'+h(t('saving'))+'</p>';
  if(msg)body+='<p class="qz-err" role="alert">'+h(msg)+' <button type="button" class="qz-link" data-retry>'+h(t('retry'))+'</button></p>';
  root.innerHTML=head+body+'</section>';
}
function renderResult(){
  var r=S.result||{score:0,outOf:Q().qs.length,starMissed:[]},qs=Q().qs;
  var x='<section class="qz-card qz-res"><p class="qz-k">'+h(Q().title[lang])+'</p>'+(S.already?'<p class="qz-note">'+h(t('already'))+'</p>':'')+'<h1>'+h(S.status==='Timed out'?t('timedOut'):t('doneTitle'))+'</h1><p class="qz-score">'+h(t('score',{s:r.score,n:r.outOf}))+'</p>';
  x+=r.starMissed.length?'<p class="qz-starmiss">'+h(t('starMissed',{list:r.starMissed.join(', ')}))+'</p>':'<p class="qz-starok">'+h(t('starAll'))+'</p>';
  x+='<p class="qz-small">'+h(t('learning'))+'</p><ol class="qz-review">'+qs.map(function(q,i){var a=S.answered[i],ok=a&&a.c===a.correct,tx=txt(q);return '<li class="'+(ok?'ok':'bad')+'"><span class="qz-mark">'+(ok?'✓':'✗')+'</span><div><b>'+(q.star?'★ ':'')+h(tx.q)+'</b>'+(a?'':'<em>'+h(t('notAnswered'))+'</em>')+(a&&!ok?'<em>'+h(tx.o[a.correct])+'</em>':'')+'</div></li>'}).join('')+'</ol>';
  var task=Q().task[lang];x+='<div class="qz-task"><h2>'+h(t('taskTitle'))+'</h2><p>'+h(task)+'</p><a class="qz-btn" href="https://wa.me/'+D.wa+'?text='+encodeURIComponent((pick.name?pick.name+': ':'')+Q().title[lang])+'" target="_blank" rel="noopener">'+h(t('taskBtn'))+'</a></div><p class="qz-thanks">'+h(t('thanks'))+'</p></section>';
  root.innerHTML=x;
}
function finish(){if(!S||busy)return;busy=true;api('finish',{id:S.id,key:S.key}).then(function(j){busy=false;load(j)}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
function start(){
  var nm=(document.getElementById('qz-name')||{}).value||'',ph=((document.getElementById('qz-phone')||{}).value||'').replace(/\D/g,'').slice(-10);pick.name=nm.trim();pick.phone=ph;
  if(!pick.name){msg=t('errName');render();return}if(ph.length!==10){msg=t('errPhone');render();return}if(!pick.quiz){msg=t('errQuiz');render();return}
  msg='';busy=true;render();
  api('start',{name:pick.name,phone:ph,quiz:pick.quiz}).then(function(j){busy=false;if(!j.fresh&&j.status!=='In progress')j.already=1;load(j)}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()});
}
function answer(o){if(busy||!S)return;var n=cur;busy=true;msg='';render();api('answer',{id:S.id,key:S.key,q:n,choice:o}).then(function(j){busy=false;var keep=n;if(j.status==='Finished'&&j.answered[keep])showLast=keep;load(j);if(S.status==='In progress'||showLast!==null){cur=keep;render()}}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.lang){setLang(b.dataset.lang);return}
  if(b.dataset.quiz){pick.quiz=+b.dataset.quiz;msg='';pick.name=(document.getElementById('qz-name')||{}).value||pick.name;pick.phone=(document.getElementById('qz-phone')||{}).value||pick.phone;render();return}
  if(b.hasAttribute('data-start')){start();return}
  if(b.dataset.o!==undefined){answer(+b.dataset.o);return}
  if(b.hasAttribute('data-next')){cur=firstOpen();render();window.scrollTo(0,0);return}
  if(b.hasAttribute('data-finish')){if(S&&S.status!=='In progress'){showLast=null;render();window.scrollTo(0,0)}else finish();return}
  if(b.hasAttribute('data-retry')){msg='';if(S&&S.status==='In progress'&&left()<=0){finish();return}render();return}
});
langBar.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.lang)setLang(b.dataset.lang)});
// resume an attempt on this device after a refresh
var saved=null;try{saved=JSON.parse(ls('qz-att')||'null')}catch(e){}
if(lang){document.documentElement.lang=lang==='en'?'en-IN':lang}
drawLang();
if(saved&&saved.phone&&saved.name){pick={name:saved.name,phone:saved.phone,quiz:saved.quiz};busy=true;render();api('start',{name:saved.name,phone:saved.phone,quiz:saved.quiz}).then(function(j){busy=false;load(j)}).catch(function(){busy=false;render()})}else render();
})();`;

const QUIZ_CSS = `
:root{--ink:#221d19;--ink2:#4a423b;--muted:#776c62;--paper:#f6f1e8;--card:#fffdf9;--line:#e4dccf;--forest:#2c4535;--moss:#e7eee3;--clay:#b8612f;--clay2:#9c4f24;--ok:#2f6b3f;--bad:#a63d2a}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 "DM Sans","Noto Sans Devanagari",system-ui,sans-serif}
[lang=hi],[lang=mr],html[lang=hi] body,html[lang=mr] body{font-family:"Noto Sans Devanagari","DM Sans",system-ui,sans-serif}
.qz-top{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:var(--forest)}
.qz-top img{height:36px;width:auto;background:#fff;border-radius:6px;padding:2px}
.qz-lang{display:flex;gap:6px}.qz-lang[hidden]{display:none}
.qz-lang button{border:1.5px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}
.qz-lang button.on{background:#fff;color:var(--forest);border-color:#fff;font-weight:700}
main{max-width:640px;margin:0 auto;padding:16px 16px 48px}
.qz-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px 18px;margin-top:12px}
.qz-k{font:700 12px/1.4 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:0 0 8px}
h1{font:800 34px/1.05 "Big Shoulders Display","Noto Sans Devanagari",sans-serif;text-transform:uppercase;margin:0 0 16px}
html[lang=hi] h1,html[lang=mr] h1,.qz-pick h1 span{font-family:"Noto Sans Devanagari",sans-serif;text-transform:none;font-weight:700;font-size:28px;line-height:1.3}
h2{font-size:21px;line-height:1.35;margin:0 0 14px}
.qz-langs{display:grid;gap:12px;margin-top:8px}
.qz-big{min-height:64px;border-radius:16px;border:2px solid var(--line);background:var(--paper);font:700 24px "Noto Sans Devanagari","DM Sans",sans-serif;color:var(--ink);cursor:pointer}
.qz-big:active,.qz-big:hover{border-color:var(--forest);background:var(--moss)}
.qz-f{display:block;margin:0 0 14px}.qz-f span{display:block;font-weight:700;margin-bottom:6px}.qz-f small{display:block;color:var(--muted);font-size:14px;margin-top:6px}
.qz-f input{width:100%;min-height:52px;border:2px solid var(--line);border-radius:12px;padding:10px 14px;font:inherit;font-size:19px;background:#fff;color:var(--ink)}
.qz-f input:focus{outline:none;border-color:var(--forest)}
.qz-quizzes{display:grid;gap:10px;margin-bottom:18px}
.qz-quiz{text-align:left;border:2px solid var(--line);border-radius:14px;background:var(--paper);padding:14px 16px;font:inherit;color:var(--ink);cursor:pointer;display:flex;flex-direction:column;gap:4px}
.qz-quiz b{font-size:18px}.qz-quiz span{color:var(--ink2);font-size:15px}
.qz-quiz.on{border-color:var(--forest);background:var(--moss)}
.qz-rules{background:var(--paper);border-radius:14px;padding:14px 16px;margin:4px 0 18px}.qz-rules h2{font-size:17px;margin:0 0 8px}
.qz-rules ul{margin:0;padding-left:20px}.qz-rules li{margin:6px 0;color:var(--ink2);font-size:15.5px}
.qz-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:56px;border:0;border-radius:999px;background:var(--clay);color:#fff;font:700 18px "DM Sans","Noto Sans Devanagari",sans-serif;cursor:pointer;text-decoration:none;margin-top:16px}
.qz-btn:disabled{opacity:.6}
.qz-err{color:var(--bad);font-weight:700;background:#fbeae5;border-radius:10px;padding:10px 12px}
.qz-link{background:none;border:0;color:var(--clay);font:inherit;font-weight:700;text-decoration:underline;cursor:pointer}
.qz-bar{position:sticky;top:56px;z-index:4;background:var(--paper);padding:8px 0;display:flex;gap:14px;align-items:center}
.qz-timer{background:var(--forest);color:#fff;border-radius:12px;padding:6px 12px;text-align:center;min-width:92px}
.qz-timer span{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}.qz-timer b{font-size:22px;font-variant-numeric:tabular-nums}
.qz-timer.low{background:var(--bad)}
.qz-prog{flex:1}.qz-prog span{font-weight:700;font-size:14px}.qz-track{height:8px;background:var(--line);border-radius:999px;overflow:hidden;margin-top:6px}.qz-track i{display:block;height:100%;background:var(--forest)}
.qz-star{display:inline-block;background:#fff1e6;color:var(--clay2);font-weight:700;border-radius:999px;padding:4px 12px;font-size:14px;margin:0 0 10px}
.qz-opts{display:grid;gap:10px}
.qz-opt{display:flex;gap:12px;align-items:flex-start;text-align:left;border:2px solid var(--line);border-radius:14px;background:var(--paper);padding:14px;font:inherit;color:var(--ink);cursor:pointer;min-height:56px}
.qz-opt:not(:disabled):active{border-color:var(--forest);background:var(--moss)}
.qz-l{flex:0 0 30px;height:30px;border-radius:50%;background:#fff;border:2px solid var(--line);display:grid;place-items:center;font-weight:700;font-size:15px}
.qz-opt.ok{border-color:var(--ok);background:#e6f2e8}.qz-opt.ok .qz-l{background:var(--ok);border-color:var(--ok);color:#fff}
.qz-opt.bad{border-color:var(--bad);background:#fbeae5}.qz-opt.bad .qz-l{background:var(--bad);border-color:var(--bad);color:#fff}
.qz-opt.dim{opacity:.55}.qz-opt:disabled{cursor:default}
.qz-why{margin-top:14px;border-radius:14px;padding:14px 16px;border-left:5px solid}
.qz-why.ok{background:#e6f2e8;border-color:var(--ok)}.qz-why.bad{background:#fbeae5;border-color:var(--bad)}
.qz-why p{margin:0 0 8px}.qz-verdict{font-weight:700;font-size:19px}.qz-src{color:var(--muted);font-size:14px;margin:0!important}
.qz-saving{color:var(--muted);text-align:center;margin-top:14px}
.qz-score{font-size:24px;font-weight:700;margin:0 0 10px}
.qz-starok{background:#e6f2e8;color:var(--ok);font-weight:700;border-radius:12px;padding:12px 14px}
.qz-starmiss{background:#fff1e6;color:var(--clay2);font-weight:700;border-radius:12px;padding:12px 14px}
.qz-note{background:var(--moss);border-radius:12px;padding:10px 12px;font-weight:700}
.qz-small{color:var(--muted);font-size:15px}
.qz-review{list-style:none;padding:0;margin:16px 0}.qz-review li{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:15.5px}
.qz-review b{font-weight:500}.qz-review em{display:block;font-style:normal;color:var(--ok);font-weight:700;margin-top:4px}
.qz-mark{flex:0 0 24px;font-weight:700}.qz-review .ok .qz-mark{color:var(--ok)}.qz-review .bad .qz-mark{color:var(--bad)}
.qz-task{background:var(--forest);color:#fff;border-radius:16px;padding:16px;margin-top:10px}.qz-task h2{font-size:18px}.qz-task p{color:#e2ebe4;margin:0}
.qz-task .qz-btn{background:#25d366}
.qz-thanks{color:var(--ink2);text-align:center;margin-top:18px}
`;
