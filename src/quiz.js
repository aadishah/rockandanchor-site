// ---------- Post-training quiz (staging only) ----------
// Source: "12 Post-Training Quizzes DRAFT" (Foundation Training 15 to 17 Oct 2026). English is the draft text.
// Hindi and Marathi were translated for this page and need review by a native speaker before wide use.
// Rules: one attempt per phone number per quiz, timed, answers locked once chosen, the right answer and
// the "why" are only sent after an answer is saved. Attempts are stored in the Airtable table Quiz Attempts.

const QUIZ_MINUTES = 20;
const QUIZ_TRAINER_WA = '919167954430';
// Last moment a new quiz can be started (end of 23 Oct 2026, IST). Attempts already running may finish their time.
const QUIZ_CLOSES = Date.parse('2026-10-24T00:00:00+05:30');
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
        en: { q: 'At a waterfall, what do two whistle blasts mean?', o: ['Someone is lost.', 'Lunch is ready.', 'Everyone out of the water immediately.', 'Swim to the rope.'], why: 'Do not confuse this with three blasts, the international distress signal: emergency, I need help.' },
        hi: { q: 'झरने पर, सीटी की दो आवाज़ों का क्या मतलब है?', o: ['कोई खो गया है।', 'खाना तैयार है।', 'सब लोग तुरंत पानी से बाहर निकलें।', 'रस्सी की ओर तैरें।'], why: 'इसे तीन सीटी से न मिलाएँ। तीन सीटी दुनिया भर में इमरजेंसी का संकेत है: मुझे मदद चाहिए।' },
        mr: { q: 'धबधब्यावर शिट्टीच्या दोन आवाजांचा अर्थ काय?', o: ['कोणी हरवले आहे.', 'जेवण तयार आहे.', 'सगळ्यांनी लगेच पाण्याबाहेर या.', 'दोरीकडे पोहत जा.'], why: 'हे तीन शिट्ट्यांशी गोंधळू नका. तीन शिट्ट्या हा जगभर वापरला जाणारा इमर्जन्सीचा संकेत आहे: मला मदत हवी आहे.' } },
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
        en: { q: 'Which instruction follows AIRC best?', o: ['"Everyone, stop here and look at me. Stop before the stream. One person crosses at a time. Wait for my signal. Be careful, okay? Let\'s go."', '"Everyone, stop here and look at me. Stop before the stream. One person crosses at a time. Wait for my signal. The rocks under the water are loose. Rahul, tell me: what do we do at the stream?"', '"Stop before the stream. One person crosses at a time, because the rocks under the water are loose. Wait for my signal. Does everyone understand?"', '"Everyone, look at me. The rocks under the water are loose and people slip here every monsoon, so be very careful at the stream. Rahul, are you ready?"'], why: 'The right one has it all: attention first, an exact instruction, the information they need (the rocks are loose), and one named person saying it back. The others each miss something: one never says why and never checks; one starts without getting attention and asks the whole group "does everyone understand?"; one explains the danger but never says exactly what to do. A full AIRC briefing has six steps: Attention, Instruction, Information, Reason, Review, Confirmation.' },
        hi: { q: 'कौन-सा निर्देश AIRC का सबसे अच्छा पालन करता है?', o: ['"सब लोग, यहाँ रुकिए और मेरी तरफ़ देखिए। नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा। मेरे इशारे का इंतज़ार करें। ध्यान रखना, ठीक है? चलो।"', '"सब लोग, यहाँ रुकिए और मेरी तरफ़ देखिए। नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा। मेरे इशारे का इंतज़ार करें। पानी के नीचे के पत्थर हिलते हैं। राहुल, बताओ: नाले पर हमें क्या करना है?"', '"नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा, क्योंकि पानी के नीचे के पत्थर हिलते हैं। मेरे इशारे का इंतज़ार करें। सबको समझ आया?"', '"सब लोग, मेरी तरफ़ देखिए। पानी के नीचे के पत्थर हिलते हैं और हर मानसून में यहाँ लोग फिसलते हैं, इसलिए नाले पर बहुत ध्यान रखना। राहुल, तैयार हो?"'], why: 'सही वाले में सब कुछ है: पहले ध्यान, साफ़ निर्देश, ज़रूरी जानकारी (पत्थर हिलते हैं), और नाम लेकर एक व्यक्ति से दोहरवाना। बाकी हर एक में कुछ छूटा है: एक में न कारण है, न पुष्टि; एक ध्यान लिए बिना शुरू होता है और पूरे ग्रुप से "सबको समझ आया?" पूछता है; एक ख़तरा तो बताता है पर यह नहीं बताता कि ठीक-ठीक क्या करना है। पूरी AIRC ब्रीफ़िंग में छह कदम होते हैं: Attention, Instruction, Information, Reason, Review, Confirmation।' },
        mr: { q: 'कोणती सूचना AIRC चे सगळ्यात चांगले पालन करते?', o: ['"सगळे, इथे थांबा आणि माझ्याकडे पाहा. ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल. माझ्या इशाऱ्याची वाट पाहा. काळजी घ्या, ठीक आहे? चला."', '"सगळे, इथे थांबा आणि माझ्याकडे पाहा. ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल. माझ्या इशाऱ्याची वाट पाहा. पाण्याखालचे दगड हलतात. राहुल, सांग: ओढ्यावर आपण काय करायचे?"', '"ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल, कारण पाण्याखालचे दगड हलतात. माझ्या इशाऱ्याची वाट पाहा. सगळ्यांना समजले का?"', '"सगळे, माझ्याकडे पाहा. पाण्याखालचे दगड हलतात आणि दर पावसाळ्यात इथे लोक घसरतात, म्हणून ओढ्यावर खूप काळजी घ्या. राहुल, तयार आहेस?"'], why: 'बरोबर उत्तरात सगळे आहे: आधी लक्ष, नेमकी सूचना, आवश्यक माहिती (दगड हलतात), आणि नाव घेऊन एका व्यक्तीकडून पुन्हा सांगून घेणे. बाकी प्रत्येकात काहीतरी सुटले आहे: एकात कारणही नाही आणि खात्रीही नाही; एक लक्ष न वेधता सुरू होते आणि पूर्ण ग्रुपला "सगळ्यांना समजले का?" विचारते; एक धोका सांगते पण नेमके काय करायचे ते सांगत नाही. पूर्ण AIRC ब्रीफिंगमध्ये सहा पायऱ्या असतात: Attention, Instruction, Information, Reason, Review, Confirmation.' } },
      { star: 0, ans: 1, src: 'Module 4 (Confirmation)',
        en: { q: 'What is the strongest way to confirm people understood?', o: ['"Is everyone OK?"', 'Ask one named person to tell you what to do next.', 'Repeat the instruction louder.', 'Assume that silence means yes.'], why: '' },
        hi: { q: 'लोगों को समझ आया या नहीं, यह पक्का करने का सबसे अच्छा तरीका क्या है?', o: ['"सब ठीक हैं?"', 'किसी एक व्यक्ति का नाम लेकर उससे पूछें कि आगे क्या करना है।', 'निर्देश ज़ोर से दोहराएँ।', 'मान लें कि चुप रहने का मतलब हाँ है।'], why: '' },
        mr: { q: 'लोकांना समजले की नाही याची खात्री करण्याचा सगळ्यात चांगला मार्ग कोणता?', o: ['"सगळे ठीक आहेत ना?"', 'एका व्यक्तीचे नाव घेऊन त्याला पुढे काय करायचे ते विचारा.', 'सूचना मोठ्याने पुन्हा सांगा.', 'गप्प राहणे म्हणजे हो, असे समजा.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 3, 8.4, 8.5',
        en: { q: 'A participant drops an orange peel and says, "It is biodegradable." What is the best response?', o: ['Quietly pick it up yourself so the participant does not feel embarrassed.', 'Ask them to pick it up, and tell them why: here an orange peel takes about 2 years to break down, and animals eat it and get sick.', 'Remind the whole group of the rule: nothing is left on the trail, everything goes in the bag.', 'Let it go for now, and talk about Leave No Trace with everyone at the next rest stop.'], why: 'Give the "why" with the rule, and let them fix it themselves. That is how the habit sticks. Picking it up for them teaches nothing, a rule without a reason feels like a lecture, and if you wait, the moment is gone.' },
        hi: { q: 'एक प्रतिभागी संतरे का छिलका गिराता है और कहता है, "यह तो अपने-आप सड़ जाएगा।" सबसे अच्छा जवाब क्या है?', o: ['चुपचाप ख़ुद उठा लें ताकि प्रतिभागी को शर्मिंदगी न हो।', 'उनसे उठाने को कहें, और कारण बताएँ: यहाँ संतरे का छिलका सड़ने में लगभग 2 साल लगते हैं, और जानवर उसे खाकर बीमार पड़ते हैं।', 'पूरे ग्रुप को नियम याद दिलाएँ: रास्ते पर कुछ नहीं छोड़ना, सब कुछ थैली में जाता है।', 'अभी जाने दें, और अगले रुकने की जगह पर सबसे Leave No Trace के बारे में बात करें।'], why: 'नियम के साथ "क्यों" बताएँ, और उन्हें ख़ुद ठीक करने दें। आदत ऐसे ही बनती है। उनके लिए ख़ुद उठा लेने से वे कुछ नहीं सीखते, बिना कारण का नियम भाषण जैसा लगता है, और इंतज़ार करने से वह पल निकल जाता है।' },
        mr: { q: 'एक सहभागी संत्र्याची साल टाकतो आणि म्हणतो, "ती आपोआप कुजून जाईल." सगळ्यात चांगले उत्तर कोणते?', o: ['शांतपणे स्वतः उचला म्हणजे सहभागीला लाज वाटणार नाही.', 'त्यांना उचलायला सांगा, आणि कारण सांगा: इथे संत्र्याची साल कुजायला सुमारे 2 वर्षे लागतात, आणि प्राणी ती खाऊन आजारी पडतात.', 'पूर्ण ग्रुपला नियमाची आठवण करून द्या: वाटेवर काही सोडायचे नाही, सगळे पिशवीत जाते.', 'आत्ता जाऊ द्या, आणि पुढच्या थांब्यावर सगळ्यांशी Leave No Trace बद्दल बोला.'], why: 'नियमासोबत "का" सांगा, आणि त्यांना स्वतः चूक सुधारू द्या. सवय अशीच लागते. त्यांच्यासाठी स्वतः उचलल्याने ते काही शिकत नाहीत, कारणाशिवायचा नियम भाषणासारखा वाटतो, आणि थांबल्यास तो क्षण निघून जातो.' } },
      { star: 0, ans: 1, src: '8.3',
        en: { q: 'At a waterfall trek, which LNT practice is correct?', o: ['Soap is fine if it is herbal.', 'No soap or shampoo in the water. Human waste at least 60 metres from water. Carry out food waste.', 'Food scraps can go in the stream.', 'Toilet paper can be buried near the pool.'], why: '' },
        hi: { q: 'झरने वाले ट्रेक पर, कौन-सा LNT (Leave No Trace) तरीका सही है?', o: ['हर्बल हो तो साबुन ठीक है।', 'पानी में साबुन या शैंपू नहीं। शौच पानी से कम से कम 60 मीटर दूर। खाने का कचरा वापस ले जाएँ।', 'खाने का बचा हुआ नाले में डाल सकते हैं।', 'टॉयलेट पेपर कुंड के पास गाड़ सकते हैं।'], why: '' },
        mr: { q: 'धबधब्याच्या ट्रेकवर कोणती LNT (Leave No Trace) पद्धत बरोबर आहे?', o: ['हर्बल असेल तर साबण चालतो.', 'पाण्यात साबण किंवा शाम्पू नाही. शौच पाण्यापासून किमान 60 मीटर दूर. अन्नाचा कचरा परत घेऊन जा.', 'उरलेले अन्न ओढ्यात टाकू शकतो.', 'टॉयलेट पेपर डोहाजवळ पुरू शकतो.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 6',
        en: { q: 'Why must participants never feed the monkeys?', o: ['The food is expensive.', 'Feeding makes them take food aggressively and become dangerous.', 'Monkeys do not eat human food.', 'It is fine if the food is fruit.'], why: '' },
        hi: { q: 'प्रतिभागियों को बंदरों को कभी खाना क्यों नहीं खिलाना चाहिए?', o: ['खाना महँगा है।', 'खिलाने से वे झपटकर खाना छीनने लगते हैं और ख़तरनाक हो जाते हैं।', 'बंदर इंसानों का खाना नहीं खाते।', 'फल हो तो ठीक है।'], why: '' },
        mr: { q: 'सहभागींनी माकडांना कधीही खायला का देऊ नये?', o: ['खाणे महाग आहे.', 'खायला दिल्याने ते आक्रमकपणे अन्न हिसकावू लागतात आणि धोकादायक होतात.', 'माकडे माणसांचे अन्न खात नाहीत.', 'फळ असेल तर चालते.'], why: '' } },
      { star: 1, ans: 1, src: 'Scenario 1',
        en: { q: 'The group is 40 minutes from the summit and it is 2:30 PM. The group usually spends about 30 minutes at the top, and the way down takes about 2 hours. Three people keep stopping, and it is dark at 6 PM. The fit participants tell you, "Come on, let us push for the top." As a Co-Leader, what do you do?', o: ['Agree with them and lead them up.', "Tell the fit participants it is the Leader's call, give the Leader your honest read of the timings and the tired participants, then back the Leader's decision fully.", 'Ask the whole group to vote.', 'Say "we are almost there" to keep everyone moving.'], why: '40 minutes up + 30 minutes at the top + 2 hours down = 5:40 PM at the earliest, and the three tired people will be slower than that. That means coming down in the dark. The weakest member decides, and the strongest participants never decide for the group.' },
        hi: { q: 'ग्रुप चोटी से 40 मिनट दूर है और दोपहर के 2:30 बजे हैं। ग्रुप आमतौर पर चोटी पर लगभग 30 मिनट रुकता है, और नीचे उतरने में लगभग 2 घंटे लगते हैं। तीन लोग बार-बार रुक रहे हैं, और शाम 6 बजे अँधेरा हो जाता है। फ़िट प्रतिभागी आपसे कहते हैं, "चलो, ऊपर तक चलते हैं।" को-लीडर के रूप में आप क्या करेंगे?', o: ['उनसे सहमत होकर उन्हें ऊपर ले जाएँ।', 'फ़िट प्रतिभागियों को बताएँ कि फ़ैसला लीडर का है, लीडर को समय और थके हुए लोगों के बारे में अपनी सच्ची राय दें, फिर लीडर के फ़ैसले का पूरा साथ दें।', 'पूरे ग्रुप से वोट करवाएँ।', 'सबको चलाते रहने के लिए कहें "बस पहुँच ही गए"।'], why: '40 मिनट ऊपर + 30 मिनट चोटी पर + 2 घंटे नीचे = कम से कम शाम 5:40, और थके हुए तीन लोग इससे भी धीमे चलेंगे। यानी अँधेरे में नीचे उतरना। सबसे कमज़ोर सदस्य से फ़ैसला तय होता है, और सबसे तेज़ लोग कभी ग्रुप के लिए फ़ैसला नहीं करते।' },
        mr: { q: 'ग्रुप शिखरापासून 40 मिनिटे दूर आहे आणि दुपारचे 2:30 वाजले आहेत. ग्रुप साधारणपणे शिखरावर सुमारे 30 मिनिटे थांबतो, आणि खाली उतरायला सुमारे 2 तास लागतात. तीन लोक सतत थांबत आहेत, आणि संध्याकाळी 6 वाजता अंधार होतो. फिट सहभागी तुम्हाला म्हणतात, "चला, वरपर्यंत जाऊया." को-लीडर म्हणून तुम्ही काय कराल?', o: ['त्यांच्याशी सहमत होऊन त्यांना वर घेऊन जा.', 'फिट सहभागींना सांगा की निर्णय लीडरचा आहे, लीडरला वेळ आणि थकलेल्या लोकांबद्दल तुमचे प्रामाणिक मत सांगा, मग लीडरच्या निर्णयाला पूर्ण साथ द्या.', 'संपूर्ण ग्रुपचे मतदान घ्या.', 'सगळ्यांना चालत ठेवण्यासाठी म्हणा "आलोच आता".'], why: '40 मिनिटे वर + 30 मिनिटे शिखरावर + 2 तास खाली = किमान संध्याकाळी 5:40, आणि थकलेले तीन लोक याहूनही हळू चालतील. म्हणजे अंधारात खाली उतरणे. सगळ्यात कमकुवत सदस्यावरून निर्णय ठरतो, आणि सगळ्यात तगडे लोक कधीही ग्रुपसाठी निर्णय घेत नाहीत.' } },
      { star: 0, ans: 2, src: 'Scenario 2',
        en: { q: 'A 9-year-old sits on the trail crying and says he wants to go home. What do you do first?', o: ['Tell him the waterfall is only 25 minutes away, so he can do it if he keeps walking.', 'Ask his parents to calm him down while the group waits nearby.', 'Crouch to his eye level, ask calmly what is wrong, and give him water and a snack.', 'Let one parent take him back to the start while the group goes on.'], why: 'First find the real cause. Hunger, thirst, a blister or fear are the usual ones, and water and a snack fix many of them. A goal like "only 25 minutes more" helps after that. Handing it to the parents or sending him back is a last step, not the first.' },
        hi: { q: '9 साल का एक बच्चा रास्ते में बैठकर रो रहा है और कहता है कि उसे घर जाना है। आप सबसे पहले क्या करेंगे?', o: ['उसे बताएँ कि झरना बस 25 मिनट दूर है, चलते रहेगा तो पहुँच जाएगा।', 'ग्रुप पास में रुका रहे, और उसके माता-पिता से कहें कि उसे शांत करें।', 'उसकी आँखों के बराबर नीचे बैठें, शांति से पूछें कि क्या हुआ, और पानी व कुछ खाने को दें।', 'एक माता-पिता को उसे शुरुआत की जगह वापस ले जाने दें, और ग्रुप आगे बढ़े।'], why: 'पहले असली कारण पता करें। भूख, प्यास, छाला या डर अक्सर कारण होते हैं, और पानी व कुछ खाने से इनमें से कई ठीक हो जाते हैं। "बस 25 मिनट और" जैसा लक्ष्य उसके बाद काम आता है। माता-पिता पर छोड़ देना या उसे वापस भेजना आख़िरी कदम है, पहला नहीं।' },
        mr: { q: '9 वर्षांचा एक मुलगा वाटेत बसून रडत आहे आणि म्हणतो की त्याला घरी जायचे आहे. तुम्ही सगळ्यात आधी काय कराल?', o: ['त्याला सांगा की धबधबा फक्त 25 मिनिटांवर आहे, चालत राहिला तर पोहोचेल.', 'ग्रुप जवळच थांबू द्या, आणि त्याच्या आई-वडिलांना त्याला शांत करायला सांगा.', 'त्याच्या डोळ्यांच्या पातळीवर खाली बसा, शांतपणे विचारा काय झाले, आणि पाणी व खाऊ द्या.', 'एका पालकाला त्याला सुरुवातीच्या जागी परत नेऊ द्या, आणि ग्रुप पुढे जाऊ दे.'], why: 'आधी खरे कारण शोधा. भूक, तहान, फोड किंवा भीती ही नेहमीची कारणे असतात, आणि पाणी व खाऊ दिल्याने यातली बरीच दूर होतात. "फक्त 25 मिनिटे अजून" असे ध्येय त्यानंतर उपयोगी पडते. आई-वडिलांवर सोडणे किंवा त्याला परत पाठवणे ही शेवटची पायरी आहे, पहिली नाही.' } },
      { star: 0, ans: 2, src: 'Scenario 7',
        en: { q: 'Village women arrive at the lake to wash clothes while your group is swimming. Which of these is a mistake?', o: ['Greeting them respectfully: "Namaskar tai. Aap aaramse kaam karein."', 'Letting participants watch quietly without filling the silence.', 'Photographing the women without asking.', 'Asking afterwards, "What did that change for you?"'], why: 'Without consent, a real moment becomes a tourist performance.' },
        hi: { q: 'आपका ग्रुप तैर रहा है, तभी गाँव की महिलाएँ कपड़े धोने तालाब पर आती हैं। इनमें से कौन-सी बात ग़लती है?', o: ['उनका सम्मान से अभिवादन करना: "नमस्कार ताई। आप आराम से काम करें।"', 'प्रतिभागियों को चुपचाप देखने देना, ख़ामोशी को बातों से न भरना।', 'बिना पूछे महिलाओं की फ़ोटो लेना।', 'बाद में पूछना, "इससे आपके लिए क्या बदला?"'], why: 'बिना अनुमति के, एक असली पल पर्यटकों का तमाशा बन जाता है।' },
        mr: { q: 'तुमचा ग्रुप पोहत असताना गावातील महिला कपडे धुण्यासाठी तलावावर येतात. यापैकी कोणती गोष्ट चूक आहे?', o: ['त्यांना आदराने नमस्कार करणे: "नमस्कार ताई. तुम्ही निवांत काम करा."', 'सहभागींना शांतपणे पाहू देणे, शांतता बोलण्याने न भरणे.', 'न विचारता महिलांचे फोटो काढणे.', 'नंतर विचारणे, "यामुळे तुमच्यासाठी काय बदलले?"'], why: 'परवानगी नसेल तर खरा क्षण पर्यटकांसाठीचा तमाशा बनतो.' } },
    ],
  },
  3: {
    name: 'Quiz 3: Skills in the Field',
    title: { en: 'Quiz 3: Skills in the Field', hi: 'क्विज़ 3: मैदान के हुनर', mr: 'क्विझ 3: मैदानातील कौशल्ये' },
    read: { en: 'Think back to the hazard walk, the maps, the camp night and the skits.', hi: 'हैज़र्ड वॉक, नक्शे, कैंप की रात और नाटकों को याद करें।', mr: 'हॅझर्ड वॉक, नकाशे, कॅम्पची रात्र आणि नाटुकल्या आठवा.' },
    task: {
      en: 'Draw a simple map of your village or a trail you know. Show north, the path, water, one hazard, and a legend with at least 4 symbols. Send a photo of it to your trainer.',
      hi: 'अपने गाँव या किसी जाने-पहचाने रास्ते का एक सादा नक्शा बनाएँ। उसमें उत्तर दिशा, रास्ता, पानी, एक ख़तरा, और कम से कम 4 चिन्हों वाली लेजेंड (चिन्ह-सूची) दिखाएँ। उसकी फ़ोटो अपने ट्रेनर को भेजें।',
      mr: 'तुमच्या गावाचा किंवा ओळखीच्या वाटेचा एक साधा नकाशा काढा. त्यात उत्तर दिशा, वाट, पाणी, एक धोका, आणि किमान 4 चिन्हांची लेजेंड (चिन्ह-सूची) दाखवा. त्याचा फोटो तुमच्या ट्रेनरला पाठवा.',
    },
    qs: [
      { star: 0, ans: 2, src: 'Training: hazard walk; Module 5',
        en: { q: 'Which of these is a human hazard?', o: ['Loose rocks below a cliff after heavy rain', 'Lightning on a ridge', 'Broken glass left near the trail by visitors', 'A stream rising fast after rain'], why: 'Natural hazards come from the land and the weather: rockfall, lightning, fast water. Human hazards are made or left by people: broken glass, litter, a fire left burning, vehicles on the road.' },
        hi: { q: 'इनमें से कौन-सा इंसानों से बना ख़तरा है?', o: ['भारी बारिश के बाद चट्टान के नीचे ढीले पत्थर', 'पहाड़ की धार पर बिजली', 'रास्ते के पास लोगों का छोड़ा हुआ टूटा काँच', 'बारिश के बाद तेज़ी से बढ़ता नाला'], why: 'प्राकृतिक ख़तरे ज़मीन और मौसम से आते हैं: गिरते पत्थर, बिजली, तेज़ पानी। इंसानी ख़तरे लोग बनाते या छोड़ जाते हैं: टूटा काँच, कचरा, जलती छोड़ी आग, सड़क पर गाड़ियाँ।' },
        mr: { q: 'यापैकी कोणता धोका माणसांमुळे निर्माण झालेला आहे?', o: ['मुसळधार पावसानंतर कड्याखाली सैल दगड', 'धारेवर वीज', 'वाटेजवळ लोकांनी टाकलेली फुटकी काच', 'पावसानंतर झपाट्याने वाढणारा ओढा'], why: 'नैसर्गिक धोके जमीन आणि हवामानातून येतात: पडणारे दगड, वीज, वेगवान पाणी. माणसांमुळे होणारे धोके लोक तयार करतात किंवा मागे सोडतात: फुटकी काच, कचरा, पेटती सोडलेली आग, रस्त्यावरची वाहने.' } },
      { star: 1, ans: 1, src: 'Training: hazard walk; Module 5.1; Module 16',
        en: { q: 'You spot a hazard ahead. Which report to the Leader is the most useful?', o: ['"There is something dangerous up there."', '"Loose rocks on the left of the path, about 50 metres after the big tree. Someone could slip and fall. I have stopped the group here."', 'Say nothing now and mention it at the end of the day.', 'Take a photo and post it in the group chat.'], why: 'A report the Leader can act on says what it is, exactly where, how serious it is, and what you have already done.' },
        hi: { q: 'आपको आगे एक ख़तरा दिखता है। लीडर को कौन-सी रिपोर्ट सबसे काम की है?', o: ['"ऊपर कुछ ख़तरनाक है।"', '"रास्ते के बाईं ओर ढीले पत्थर हैं, बड़े पेड़ के लगभग 50 मीटर बाद। कोई फिसलकर गिर सकता है। मैंने ग्रुप को यहीं रोक दिया है।"', 'अभी कुछ न कहें, दिन के आख़िर में बताएँ।', 'फ़ोटो लेकर ग्रुप चैट में डाल दें।'], why: 'जिस रिपोर्ट पर लीडर तुरंत कदम उठा सके, उसमें होता है: ख़तरा क्या है, ठीक कहाँ है, कितना गंभीर है, और आपने अब तक क्या किया।' },
        mr: { q: 'तुम्हाला पुढे एक धोका दिसतो. लीडरला कोणता रिपोर्ट सगळ्यात उपयोगी आहे?', o: ['"वर काहीतरी धोकादायक आहे."', '"वाटेच्या डाव्या बाजूला सैल दगड आहेत, मोठ्या झाडानंतर साधारण 50 मीटरवर. कोणी घसरून पडू शकतं. मी ग्रुपला इथेच थांबवलं आहे."', 'आत्ता काही बोलू नका, दिवसाच्या शेवटी सांगा.', 'फोटो काढून ग्रुप चॅटमध्ये टाका.'], why: 'ज्या रिपोर्टवर लीडर लगेच कृती करू शकतो, त्यात असते: धोका काय आहे, नेमका कुठे आहे, किती गंभीर आहे, आणि तुम्ही आतापर्यंत काय केले.' } },
      { star: 0, ans: 1, src: 'Training: map making',
        en: { q: 'What is the legend on a map?', o: ['The name of the map at the top', 'The box that explains what each symbol and colour means', 'The arrow that shows north', 'The line that shows distance'], why: 'Without a legend, nobody else can read your symbols. A map you draw for others always needs one.' },
        hi: { q: 'नक्शे पर लेजेंड क्या होती है?', o: ['ऊपर लिखा नक्शे का नाम', 'वह डिब्बा जो बताता है कि हर चिन्ह और रंग का मतलब क्या है', 'उत्तर दिशा दिखाने वाला तीर', 'दूरी दिखाने वाली रेखा'], why: 'लेजेंड के बिना कोई और आपके चिन्ह नहीं पढ़ सकता। दूसरों के लिए बनाए नक्शे में लेजेंड हमेशा चाहिए।' },
        mr: { q: 'नकाशावरची लेजेंड म्हणजे काय?', o: ['वर लिहिलेले नकाशाचे नाव', 'प्रत्येक चिन्ह आणि रंगाचा अर्थ सांगणारी चौकट', 'उत्तर दिशा दाखवणारा बाण', 'अंतर दाखवणारी रेषा'], why: 'लेजेंडशिवाय दुसरे कोणी तुमची चिन्हे वाचू शकत नाही. इतरांसाठी काढलेल्या नकाशाला लेजेंड नेहमी हवी.' } },
      { star: 0, ans: 0, src: 'Training: maps', img: 'contour',
        en: { q: 'This picture shows contour lines of a hill. Which side of the hill is steeper?', o: ['The left side, where the lines are close together', 'The right side, where the lines are far apart', 'Both sides are the same', 'Contour lines do not show steepness'], why: 'Each contour line joins points at the same height. Lines close together mean the height changes quickly over a short distance: steep. Lines far apart mean gentle ground.' },
        hi: { q: 'इस चित्र में एक पहाड़ी की कंटूर रेखाएँ हैं। पहाड़ी की कौन-सी तरफ़ ज़्यादा खड़ी (तीखी चढ़ाई वाली) है?', o: ['बाईं तरफ़, जहाँ रेखाएँ पास-पास हैं', 'दाईं तरफ़, जहाँ रेखाएँ दूर-दूर हैं', 'दोनों तरफ़ एक जैसी हैं', 'कंटूर रेखाओं से ढलान का पता नहीं चलता'], why: 'हर कंटूर रेखा एक जैसी ऊँचाई वाली जगहों को जोड़ती है। पास-पास रेखाएँ मतलब कम दूरी में ऊँचाई तेज़ी से बदलती है: खड़ी चढ़ाई। दूर-दूर रेखाएँ मतलब हल्की ढलान।' },
        mr: { q: 'या चित्रात एका टेकडीच्या कंटूर रेषा आहेत. टेकडीची कोणती बाजू जास्त उभी (तीव्र चढाची) आहे?', o: ['डावी बाजू, जिथे रेषा जवळजवळ आहेत', 'उजवी बाजू, जिथे रेषा दूरदूर आहेत', 'दोन्ही बाजू सारख्याच आहेत', 'कंटूर रेषांवरून उतार कळत नाही'], why: 'प्रत्येक कंटूर रेषा सारख्या उंचीवरच्या जागा जोडते. जवळजवळ रेषा म्हणजे कमी अंतरात उंची वेगाने बदलते: उभा चढ. दूरदूर रेषा म्हणजे सौम्य उतार.' } },
      { star: 0, ans: 1, src: 'Training: maps', img: 'contour',
        en: { q: 'In the same picture, what does the smallest ring in the middle show?', o: ['A lake', 'The top of the hill', 'A village', 'The start of the trail'], why: 'Rings that get smaller and smaller show the ground rising. The smallest ring is the highest part: the top.' },
        hi: { q: 'उसी चित्र में, बीच का सबसे छोटा घेरा क्या दिखाता है?', o: ['एक तालाब', 'पहाड़ी की चोटी', 'एक गाँव', 'रास्ते की शुरुआत'], why: 'छोटे होते जाते घेरे दिखाते हैं कि ज़मीन ऊपर उठ रही है। सबसे छोटा घेरा सबसे ऊँची जगह है: चोटी।' },
        mr: { q: 'त्याच चित्रात, मधले सगळ्यात लहान वर्तुळ काय दाखवते?', o: ['एक तलाव', 'टेकडीचे शिखर', 'एक गाव', 'वाटेची सुरुवात'], why: 'लहान लहान होत जाणारी वर्तुळे दाखवतात की जमीन वर चढत आहे. सगळ्यात लहान वर्तुळ म्हणजे सगळ्यात उंच जागा: शिखर.' } },
      { star: 1, ans: 1, src: 'Module 6.1; Module 20 (Insulation, Emergency Heat)',
        en: { q: 'After a long swim and then rain, a participant is shivering hard, speaking slowly and stumbling. What is most likely happening?', o: ['Heat exhaustion', 'Hypothermia: the body is losing heat', 'Just tiredness', 'Too much food'], why: 'Shivering, clumsiness, slow or slurred speech and confusion mean the body is losing heat. Get them out of the wind and wet, change into dry layers, wrap them in the emergency blanket, give a warm sweet drink if they are fully awake. If they become confused, evacuate.' },
        hi: { q: 'लंबे समय तैरने और फिर बारिश के बाद, एक प्रतिभागी ज़ोर से काँप रहा है, धीरे बोल रहा है और लड़खड़ा रहा है। सबसे ज़्यादा संभावना क्या है?', o: ['गर्मी से थकावट (हीट एग्ज़ॉशन)', 'हाइपोथर्मिया: शरीर की गर्मी कम हो रही है', 'बस थकान', 'ज़्यादा खाना'], why: 'काँपना, लड़खड़ाना, धीमा या अटकता बोलना और उलझन का मतलब है शरीर की गर्मी कम हो रही है। हवा और गीलेपन से हटाएँ, सूखे कपड़े पहनाएँ, इमरजेंसी ब्लैंकेट में लपेटें, पूरी तरह होश में हो तो गर्म मीठा पेय दें। अगर उलझन बढ़े, तो बाहर ले जाएँ (इवैक्युएशन)।' },
        mr: { q: 'खूप वेळ पोहल्यानंतर आणि मग पावसानंतर, एक सहभागी जोरात थरथरत आहे, हळू बोलत आहे आणि अडखळत आहे. सगळ्यात जास्त शक्यता काय आहे?', o: ['उष्णतेमुळे थकवा (हीट एक्झॉशन)', 'हायपोथर्मिया: शरीरातील उष्णता कमी होत आहे', 'फक्त थकवा', 'जास्त जेवण'], why: 'थरथरणे, अडखळणे, हळू किंवा अडखळत बोलणे आणि गोंधळ म्हणजे शरीरातील उष्णता कमी होत आहे. वारा आणि ओलाव्यापासून दूर न्या, कोरडे कपडे घाला, इमर्जन्सी ब्लँकेटमध्ये गुंडाळा, पूर्ण शुद्धीवर असेल तर गरम गोड पेय द्या. गोंधळ वाढला तर बाहेर न्या (इव्हॅक्युएशन).' } },
      { star: 1, ans: 1, src: 'Module 5.2; Module 7.5',
        en: { q: 'Summer, a midday climb. A participant has a headache, feels dizzy and sick, and is sweating a lot. What do you do first?', o: ['Push on quickly so you reach the top before it gets hotter', 'Stop, move them into shade, cool them with water, give water with ORS, and rest', 'Give them hot tea', 'Wrap them in the emergency blanket'], why: 'These are signs of heat exhaustion. Cool and rest first. If they become confused, stop sweating or get worse, it is serious: evacuate.' },
        hi: { q: 'गर्मी का मौसम, दोपहर की चढ़ाई। एक प्रतिभागी को सिरदर्द है, चक्कर और मितली आ रही है, और बहुत पसीना आ रहा है। आप सबसे पहले क्या करेंगे?', o: ['जल्दी आगे बढ़ें ताकि और गर्मी होने से पहले ऊपर पहुँच जाएँ', 'रुकें, उन्हें छाँव में ले जाएँ, पानी से ठंडा करें, ORS वाला पानी दें, और आराम कराएँ', 'उन्हें गर्म चाय दें', 'उन्हें इमरजेंसी ब्लैंकेट में लपेटें'], why: 'ये गर्मी से थकावट (हीट एग्ज़ॉशन) के लक्षण हैं। पहले ठंडा करें और आराम कराएँ। अगर उलझन हो, पसीना बंद हो जाए या हालत बिगड़े, तो यह गंभीर है: बाहर ले जाएँ।' },
        mr: { q: 'उन्हाळा, दुपारचा चढ. एका सहभागीचे डोके दुखत आहे, चक्कर आणि मळमळ होत आहे, आणि खूप घाम येत आहे. तुम्ही सगळ्यात आधी काय कराल?', o: ['अजून ऊन वाढण्याआधी वर पोहोचण्यासाठी पटकन पुढे चला', 'थांबा, त्यांना सावलीत न्या, पाण्याने थंड करा, ORS घातलेले पाणी द्या, आणि आराम करू द्या', 'त्यांना गरम चहा द्या', 'त्यांना इमर्जन्सी ब्लँकेटमध्ये गुंडाळा'], why: 'ही उष्णतेमुळे थकव्याची (हीट एक्झॉशन) लक्षणे आहेत. आधी थंड करा आणि आराम करू द्या. गोंधळ झाला, घाम येणे थांबले किंवा प्रकृती बिघडली तर हे गंभीर आहे: बाहेर न्या.' } },
      { star: 1, ans: 2, src: 'Module 10.2',
        en: { q: 'Where is the best place to set up camp for the night?', o: ['In a dry stream bed, because it is flat', 'Under a big dead tree, for shade', 'On flat ground, away from drainage channels, with no dead trees or loose rocks above', 'Right at the edge of the water'], why: 'Rain at night can fill a dry stream bed in minutes. Dead branches and loose rocks fall. Flat, raised, clear ground is safe ground.' },
        hi: { q: 'रात के कैंप के लिए सबसे अच्छी जगह कौन-सी है?', o: ['सूखे नाले के तल में, क्योंकि वह समतल है', 'किसी बड़े सूखे पेड़ के नीचे, छाँव के लिए', 'समतल ज़मीन पर, पानी बहने के रास्तों से दूर, जहाँ ऊपर कोई सूखा पेड़ या ढीले पत्थर न हों', 'ठीक पानी के किनारे'], why: 'रात की बारिश सूखे नाले को मिनटों में भर सकती है। सूखी डालियाँ और ढीले पत्थर गिरते हैं। समतल, थोड़ी ऊँची, साफ़ ज़मीन ही सुरक्षित है।' },
        mr: { q: 'रात्रीच्या कॅम्पसाठी सगळ्यात चांगली जागा कोणती?', o: ['कोरड्या ओढ्याच्या पात्रात, कारण ते सपाट आहे', 'मोठ्या वाळलेल्या झाडाखाली, सावलीसाठी', 'सपाट जमिनीवर, पाणी वाहण्याच्या मार्गांपासून दूर, जिथे वर वाळलेले झाड किंवा सैल दगड नाहीत', 'अगदी पाण्याच्या काठावर'], why: 'रात्रीचा पाऊस कोरडे ओढ्याचे पात्र काही मिनिटांत भरू शकतो. वाळलेल्या फांद्या आणि सैल दगड पडतात. सपाट, थोडी उंच, मोकळी जमीनच सुरक्षित आहे.' } },
      { star: 1, ans: 0, src: 'Module 8.2, Principle 5',
        en: { q: 'Before lighting a campfire, what must you do?', o: ['Use an existing fire ring or clear a 1-metre circle of leaves and dry material, and keep water ready to put it out completely', 'Light it next to the tents so everyone stays warm', 'Use plastic to get it started', 'Plan to leave the embers burning overnight'], why: 'The forest floor is dry for much of the year and a single spark can travel. Burn everything to ash and douse it completely before you sleep or leave.' },
        hi: { q: 'कैंपफ़ायर जलाने से पहले आपको क्या करना ज़रूरी है?', o: ['पहले से बनी आग की जगह इस्तेमाल करें या 1 मीटर के घेरे से पत्ते और सूखा सामान हटाएँ, और आग पूरी तरह बुझाने के लिए पानी तैयार रखें', 'तंबुओं के पास जलाएँ ताकि सबको गर्मी मिले', 'आग शुरू करने के लिए प्लास्टिक इस्तेमाल करें', 'अंगारे रात भर जलते छोड़ने की सोचें'], why: 'साल के ज़्यादातर समय जंगल की ज़मीन सूखी रहती है और एक चिंगारी दूर तक जा सकती है। सब कुछ राख होने तक जलाएँ और सोने या जाने से पहले पूरी तरह बुझाएँ।' },
        mr: { q: 'कॅम्पफायर पेटवण्याआधी तुम्ही काय करणे आवश्यक आहे?', o: ['आधीपासून असलेली शेकोटीची जागा वापरा किंवा 1 मीटरच्या वर्तुळातील पाने आणि सुका पालापाचोळा काढा, आणि आग पूर्ण विझवण्यासाठी पाणी तयार ठेवा', 'तंबूंच्या जवळ पेटवा म्हणजे सगळ्यांना ऊब मिळेल', 'आग सुरू करण्यासाठी प्लास्टिक वापरा', 'निखारे रात्रभर पेटते ठेवायचे ठरवा'], why: 'वर्षातील बराच काळ जंगलाची जमीन कोरडी असते आणि एक ठिणगी दूरवर जाऊ शकते. सगळे राख होईपर्यंत जाळा आणि झोपण्याआधी किंवा निघण्याआधी पूर्ण विझवा.' } },
      { star: 0, ans: 1, src: 'Training: camp night; Module 11.1',
        en: { q: 'On the camp night your group had to choose the site, plan the food and decide who leads. What is the best way to work as a team?', o: ['The strongest person does everything', 'Agree on one leader, who gives each person a clear job and checks back with them', 'Everyone does whatever they want', 'Wait for the trainer to decide everything'], why: 'Delegation means one person holds the whole picture and each person knows their exact job. Nothing gets missed and nobody does everything alone.' },
        hi: { q: 'कैंप की रात आपके ग्रुप को जगह चुननी थी, खाने की योजना बनानी थी और तय करना था कि कौन लीड करेगा। टीम के रूप में काम करने का सबसे अच्छा तरीका क्या है?', o: ['सबसे ताक़तवर व्यक्ति सब कुछ करे', 'एक लीडर पर सहमत हों, जो हर व्यक्ति को साफ़ काम दे और बीच-बीच में उनसे पूछता रहे', 'हर कोई जो चाहे वो करे', 'सब कुछ तय करने के लिए ट्रेनर का इंतज़ार करें'], why: 'काम बाँटने (डेलिगेशन) का मतलब है एक व्यक्ति पूरी तस्वीर देखता है और हर व्यक्ति को अपना ठीक-ठीक काम पता होता है। कुछ छूटता नहीं और कोई अकेला सब नहीं करता।' },
        mr: { q: 'कॅम्पच्या रात्री तुमच्या ग्रुपला जागा निवडायची होती, जेवणाचे नियोजन करायचे होते आणि कोण लीड करणार ते ठरवायचे होते. टीम म्हणून काम करण्याचा सगळ्यात चांगला मार्ग कोणता?', o: ['सगळ्यात ताकदवान व्यक्तीने सगळे करावे', 'एका लीडरवर एकमत करा, जो प्रत्येकाला स्पष्ट काम देतो आणि मधूनमधून त्यांच्याकडे चौकशी करतो', 'प्रत्येकाने हवे ते करावे', 'सगळे ठरवण्यासाठी ट्रेनरची वाट पाहा'], why: 'काम वाटणे (डेलिगेशन) म्हणजे एक व्यक्ती संपूर्ण चित्र पाहते आणि प्रत्येकाला आपले नेमके काम माहीत असते. काही सुटत नाही आणि कोणी एकटा सगळे करत नाही.' } },
      { star: 0, ans: 1, src: 'Training: team sections; Module 2.7',
        en: { q: 'Which team keeps the record of the trip: photos, notes, attendance and the trip report?', o: ['Pantry team', 'Documentation team', 'Load ferry team', 'Technical team'], why: 'The documentation team records the trip. The pantry team handles food and cooking. The load ferry team moves the group\'s loads. The technical team handles ropes, safety equipment and gear.' },
        hi: { q: 'कौन-सी टीम ट्रिप का रिकॉर्ड रखती है: फ़ोटो, नोट्स, हाज़िरी और ट्रिप रिपोर्ट?', o: ['पैंट्री टीम', 'डॉक्यूमेंटेशन टीम', 'लोड फ़ेरी टीम', 'टेक्निकल टीम'], why: 'डॉक्यूमेंटेशन टीम ट्रिप का रिकॉर्ड रखती है। पैंट्री टीम खाना और खाना बनाने का काम सँभालती है। लोड फ़ेरी टीम ग्रुप का सामान ढोती है। टेक्निकल टीम रस्सी, सुरक्षा का सामान और गियर सँभालती है।' },
        mr: { q: 'कोणती टीम ट्रिपची नोंद ठेवते: फोटो, नोट्स, हजेरी आणि ट्रिप रिपोर्ट?', o: ['पॅन्ट्री टीम', 'डॉक्युमेंटेशन टीम', 'लोड फेरी टीम', 'टेक्निकल टीम'], why: 'डॉक्युमेंटेशन टीम ट्रिपची नोंद ठेवते. पॅन्ट्री टीम जेवण आणि स्वयंपाक सांभाळते. लोड फेरी टीम ग्रुपचे सामान वाहून नेते. टेक्निकल टीम दोर, सुरक्षेचे साहित्य आणि गियर सांभाळते.' } },
      { star: 0, ans: 2, src: 'Training: partner sharing game',
        en: { q: 'You meet a participant for the first time. Which question helps you get to know them best?', o: ['"Are you okay?"', '"Did you bring water?"', '"What made you want to come to the mountains today?"', '"Is this your first trek?"'], why: 'Open questions (what, why, how) invite people to share. Yes or no questions end the conversation. Asking well is a skill, and it is how relationships start. Share something about yourself too.' },
        hi: { q: 'आप किसी प्रतिभागी से पहली बार मिलते हैं। कौन-सा सवाल उन्हें सबसे अच्छी तरह जानने में मदद करता है?', o: ['"आप ठीक हैं?"', '"पानी लाए हैं?"', '"आज पहाड़ों पर आने का मन क्यों हुआ?"', '"क्या यह आपका पहला ट्रेक है?"'], why: 'खुले सवाल (क्या, क्यों, कैसे) लोगों को अपनी बात कहने का मौका देते हैं। हाँ या ना वाले सवालों से बातचीत रुक जाती है। अच्छे से पूछना एक हुनर है, और रिश्ते ऐसे ही शुरू होते हैं। अपने बारे में भी कुछ बताएँ।' },
        mr: { q: 'तुम्ही एका सहभागीला पहिल्यांदा भेटता. कोणता प्रश्न त्यांना सगळ्यात चांगले ओळखायला मदत करतो?', o: ['"तुम्ही ठीक आहात ना?"', '"पाणी आणलंय का?"', '"आज डोंगरात यावंसं का वाटलं?"', '"हा तुमचा पहिला ट्रेक आहे का?"'], why: 'मोकळे प्रश्न (काय, का, कसे) लोकांना आपली गोष्ट सांगायची संधी देतात. हो किंवा नाही च्या प्रश्नांनी गप्पा थांबतात. चांगले विचारणे हे एक कौशल्य आहे, आणि नाती अशीच सुरू होतात. स्वतःबद्दलही काहीतरी सांगा.' } },
      { star: 1, ans: 2, src: 'Module 11.1',
        en: { q: 'Lightning starts while the group is on a ridge. Which leadership style do you use?', o: ['Stepping back: let the group decide', 'Facilitating: give the group a task and watch', 'Directive: short, clear commands, no discussion', 'Guiding: share your idea and ask what they think'], why: 'In safety and emergencies the leader takes control: "Everyone stop. Now. Come back here. We go down this way."' },
        hi: { q: 'ग्रुप पहाड़ की धार पर है और बिजली शुरू हो जाती है। आप कौन-सी लीडरशिप शैली अपनाएँगे?', o: ['पीछे हटना (स्टेपिंग बैक): ग्रुप को तय करने दें', 'सहायक (फ़ैसिलिटेटिंग): ग्रुप को काम दें और देखें', 'निर्देशात्मक (डायरेक्टिव): छोटे, साफ़ आदेश, कोई बहस नहीं', 'मार्गदर्शक (गाइडिंग): अपना विचार बताएँ और उनकी राय पूछें'], why: 'सुरक्षा और इमरजेंसी में लीडर पूरी कमान लेता है: "सब रुको। अभी। यहाँ वापस आओ। हम इस तरफ़ से नीचे जाएँगे।"' },
        mr: { q: 'ग्रुप धारेवर असताना वीज सुरू होते. तुम्ही कोणती लीडरशिप शैली वापराल?', o: ['मागे राहणे (स्टेपिंग बॅक): ग्रुपला ठरवू द्या', 'सहायक (फॅसिलिटेटिंग): ग्रुपला काम द्या आणि पाहा', 'आदेशात्मक (डायरेक्टिव): छोट्या, स्पष्ट सूचना, चर्चा नाही', 'मार्गदर्शक (गाइडिंग): तुमचा विचार सांगा आणि त्यांचे मत विचारा'], why: 'सुरक्षा आणि इमर्जन्सीमध्ये लीडर पूर्ण ताबा घेतो: "सगळे थांबा. आत्ता. इकडे परत या. आपण या बाजूने खाली जाऊ."' } },
      { star: 0, ans: 2, src: 'Training: camp night; Module 11.1',
        en: { q: 'On the camp night the trainer gave your group the whole job and stood back, stepping in only for safety. Which leadership style was that?', o: ['Directive', 'Guiding', 'Stepping back', 'No leadership at all'], why: 'Stepping back is for developing leaders: give them the job, stand back, only step in for safety. It is how you learn to lead, because nobody does it for you.' },
        hi: { q: 'कैंप की रात ट्रेनर ने पूरा काम आपके ग्रुप को दिया और ख़ुद पीछे रहे, सिर्फ़ सुरक्षा के लिए बीच में आए। वह कौन-सी लीडरशिप शैली थी?', o: ['निर्देशात्मक (डायरेक्टिव)', 'मार्गदर्शक (गाइडिंग)', 'पीछे हटना (स्टेपिंग बैक)', 'कोई लीडरशिप नहीं'], why: 'पीछे हटना (स्टेपिंग बैक) नए लीडर तैयार करने के लिए है: काम उन्हें दें, ख़ुद पीछे रहें, सिर्फ़ सुरक्षा के लिए बीच में आएँ। ऐसे ही लीड करना सीखते हैं, क्योंकि कोई और आपके लिए नहीं करता।' },
        mr: { q: 'कॅम्पच्या रात्री ट्रेनरने संपूर्ण काम तुमच्या ग्रुपला दिले आणि स्वतः मागे राहिले, फक्त सुरक्षेसाठी मध्ये आले. ती कोणती लीडरशिप शैली होती?', o: ['आदेशात्मक (डायरेक्टिव)', 'मार्गदर्शक (गाइडिंग)', 'मागे राहणे (स्टेपिंग बॅक)', 'लीडरशिपच नाही'], why: 'मागे राहणे (स्टेपिंग बॅक) नवे लीडर घडवण्यासाठी आहे: काम त्यांना द्या, स्वतः मागे राहा, फक्त सुरक्षेसाठी मध्ये या. असेच लीड करायला शिकतात, कारण तुमच्यासाठी दुसरे कोणी करत नाही.' } },
      { star: 0, ans: 0, src: 'Training: AIRC skits',
        en: { q: 'An AIRC briefing has six steps. Which order is right?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'First get everyone\'s attention. Then say what to do, what they need to know, and why. Then go over the key points again, and confirm by asking one person by name.' },
        hi: { q: 'AIRC ब्रीफ़िंग में छह कदम होते हैं। सही क्रम कौन-सा है?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'पहले सबका ध्यान लें। फिर बताएँ क्या करना है, क्या जानना ज़रूरी है, और क्यों। फिर ख़ास बातें दोबारा दोहराएँ, और किसी एक का नाम लेकर पूछकर पुष्टि करें।' },
        mr: { q: 'AIRC ब्रीफिंगमध्ये सहा पायऱ्या असतात. योग्य क्रम कोणता?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'आधी सगळ्यांचे लक्ष वेधा. मग सांगा काय करायचे, काय माहीत असणे गरजेचे आहे, आणि का. मग महत्त्वाचे मुद्दे पुन्हा सांगा, आणि एका व्यक्तीचे नाव घेऊन विचारून खात्री करा.' } },
    ],
  },
};

// Pictures used by questions (no words inside, so they work in every language).
const QUIZ_IMG = { contour: (() => {
  let rings = '';
  for (let i = 0; i < 6; i++) { const l = 40 + 8 * i, r = 270 - 25 * i, cx = (l + r) / 2, rx = (r - l) / 2, ry = 70 - 11 * i; rings += `<ellipse cx="${cx}" cy="95" rx="${rx}" ry="${ry}" fill="${i === 5 ? '#e9d9bf' : 'none'}" stroke="#9c4f24" stroke-width="2"/>`; }
  return `<svg viewBox="0 0 310 190" role="img" aria-label="Contour lines of a hill: close together on the left, far apart on the right" xmlns="http://www.w3.org/2000/svg"><rect width="310" height="190" rx="12" fill="#fbf6ec"/>${rings}<path d="M290 22 l-7 16 h14 z" fill="#2c4535"/><text x="290" y="54" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#2c4535">N</text></svg>`;
})() };

const QUIZ_UI = {
  en: { lang: 'English', title: 'Post-Training Quiz', sub: 'Foundation Training, 15 to 17 October 2026', chooseLang: 'Choose your language', name: 'Your name', phone: 'Your mobile number', phoneHint: '10 digits. This makes sure each person takes each quiz once.', chooseQuiz: 'Choose the quiz', rulesTitle: 'How this works',
    rules: ['There are 3 quizzes. Do all three, in any order, by 11:59 PM on 23 October. You can do them on different days.', 'Each quiz has {min} minutes. The timer starts only when you press Start, and it does not stop.', 'Use the same mobile number every time.', 'Sit where the network is good and your phone is charged. If the page closes, open the same link and enter the same number. Your quiz continues if time is left.', 'You can take each quiz only once. Once you choose an answer it is locked and you cannot go back. You will then see why the right answer is right.', '★ marks a safety question. If you miss one, your trainer will call you and talk it through.', 'There is no pass or fail. Your trainer sees your answers. Every answer is in your manual or was practised in training.'], closed: 'The quizzes closed at 11:59 PM on 23 October. Please message your trainer.',
    start: 'Start the quiz', next: 'Next question', finish: 'See my result', timeLeft: 'Time left', qOf: 'Question {i} of {n}', right: 'Correct.', wrong: 'The right answer is {L}.', why: 'Why', source: 'Manual section', star: 'Safety question',
    doneTitle: 'Well done for finishing.', timedOut: 'Time is up.', score: 'You got {s} out of {n}.', starAll: 'You got every ★ safety question right.', starMissed: '★ safety questions to go over with your trainer: {list}. Your trainer will call you within 2 days.', learning: 'The score is for learning, not for ranking.',
    taskTitle: 'One more thing (not scored, required)', taskBtn: 'Send on WhatsApp', other: 'Go to {quiz}', already: 'You have already taken this quiz. Here is your result.', resume: 'Welcome back. Your quiz is still running.', errName: 'Please enter your name.', errPhone: 'Please enter a 10-digit mobile number.', errQuiz: 'Please choose a quiz.', errNet: 'Could not connect. Check your internet and try again.', errSrv: 'The quiz could not be saved just now. Please tell your trainer, then try again.', retry: 'Try again', notAnswered: 'Not answered', thanks: 'Thank you. The people in the mountains with you are counting on you knowing this.', saving: 'Saving…', back: 'Back' },
  hi: { lang: 'हिंदी', title: 'ट्रेनिंग के बाद की क्विज़', sub: 'फ़ाउंडेशन ट्रेनिंग, 15 से 17 अक्टूबर 2026', chooseLang: 'अपनी भाषा चुनें', name: 'आपका नाम', phone: 'आपका मोबाइल नंबर', phoneHint: '10 अंक। इससे हर व्यक्ति हर क्विज़ एक ही बार देता है।', chooseQuiz: 'क्विज़ चुनें', rulesTitle: 'यह कैसे काम करता है',
    rules: ['कुल 3 क्विज़ हैं। तीनों क्विज़, किसी भी क्रम में, 23 अक्टूबर रात 11:59 बजे तक पूरी करें। आप इन्हें अलग-अलग दिन कर सकते हैं।', 'हर क्विज़ {min} मिनट की है। टाइमर तभी शुरू होता है जब आप स्टार्ट दबाते हैं, और फिर रुकता नहीं।', 'हर बार एक ही मोबाइल नंबर डालें।', 'ऐसी जगह बैठें जहाँ नेटवर्क अच्छा हो और फ़ोन चार्ज हो। अगर पेज बंद हो जाए, तो वही लिंक खोलें और वही नंबर डालें। समय बचा हो तो आपकी क्विज़ वहीं से आगे चलेगी।', 'हर क्विज़ सिर्फ़ एक बार दे सकते हैं। जवाब चुनते ही वह लॉक हो जाता है और आप पीछे नहीं जा सकते। फिर आपको दिखेगा कि सही जवाब सही क्यों है।', '★ का मतलब सुरक्षा वाला सवाल है। अगर कोई ग़लत हुआ, तो आपके ट्रेनर आपको कॉल करके उस पर बात करेंगे।', 'इसमें पास या फ़ेल नहीं है। आपके जवाब आपके ट्रेनर देखते हैं। हर जवाब आपके मैनुअल में है या ट्रेनिंग में कराया गया था।'], closed: 'क्विज़ 23 अक्टूबर रात 11:59 बजे बंद हो गई। कृपया अपने ट्रेनर को मैसेज करें।',
    start: 'क्विज़ शुरू करें', next: 'अगला सवाल', finish: 'मेरा नतीजा देखें', timeLeft: 'बचा समय', qOf: 'सवाल {i} / {n}', right: 'सही।', wrong: 'सही जवाब {L} है।', why: 'क्यों', source: 'मैनुअल सेक्शन', star: 'सुरक्षा सवाल',
    doneTitle: 'क्विज़ पूरी करने के लिए शाबाश।', timedOut: 'समय पूरा हुआ।', score: 'आपके {n} में से {s} जवाब सही हैं।', starAll: 'आपने हर ★ सुरक्षा सवाल सही किया।', starMissed: '★ सुरक्षा सवाल जिन पर ट्रेनर से बात करनी है: {list}। आपके ट्रेनर 2 दिन के अंदर आपको कॉल करेंगे।', learning: 'यह स्कोर सीखने के लिए है, तुलना के लिए नहीं।',
    taskTitle: 'एक और काम (नंबर नहीं मिलेंगे, पर ज़रूरी है)', taskBtn: 'WhatsApp पर भेजें', other: 'आगे बढ़ें: {quiz}', already: 'आप यह क्विज़ पहले ही दे चुके हैं। यह रहा आपका नतीजा।', resume: 'फिर से स्वागत है। आपकी क्विज़ अभी चल रही है।', errName: 'कृपया अपना नाम लिखें।', errPhone: 'कृपया 10 अंकों का मोबाइल नंबर लिखें।', errQuiz: 'कृपया क्विज़ चुनें।', errNet: 'कनेक्ट नहीं हो पाया। इंटरनेट चेक करके फिर से कोशिश करें।', errSrv: 'अभी क्विज़ सेव नहीं हो पाई। कृपया अपने ट्रेनर को बताएँ, फिर से कोशिश करें।', retry: 'फिर से कोशिश करें', notAnswered: 'जवाब नहीं दिया', thanks: 'धन्यवाद। पहाड़ों में आपके साथ चलने वाले लोग इस भरोसे पर हैं कि आपको यह पता है।', saving: 'सेव हो रहा है…', back: 'वापस' },
  mr: { lang: 'मराठी', title: 'प्रशिक्षणानंतरची क्विझ', sub: 'फाउंडेशन ट्रेनिंग, 15 ते 17 ऑक्टोबर 2026', chooseLang: 'तुमची भाषा निवडा', name: 'तुमचे नाव', phone: 'तुमचा मोबाईल नंबर', phoneHint: '10 अंक. यामुळे प्रत्येक व्यक्ती प्रत्येक क्विझ एकदाच देते.', chooseQuiz: 'क्विझ निवडा', rulesTitle: 'हे कसे चालते',
    rules: ['एकूण 3 क्विझ आहेत. तिन्ही क्विझ, कोणत्याही क्रमाने, 23 ऑक्टोबर रात्री 11:59 पर्यंत पूर्ण करा. तुम्ही त्या वेगवेगळ्या दिवशी करू शकता.', 'प्रत्येक क्विझ {min} मिनिटांची आहे. टायमर फक्त स्टार्ट दाबल्यावर सुरू होतो, आणि मग थांबत नाही.', 'प्रत्येक वेळी तोच मोबाईल नंबर टाका.', 'जिथे नेटवर्क चांगले आहे आणि फोन चार्ज आहे अशा ठिकाणी बसा. पेज बंद झाले तर तीच लिंक उघडा आणि तोच नंबर टाका. वेळ उरला असेल तर तुमची क्विझ तिथूनच पुढे चालू राहील.', 'प्रत्येक क्विझ फक्त एकदाच देता येते. उत्तर निवडताच ते लॉक होते आणि तुम्ही मागे जाऊ शकत नाही. मग तुम्हाला दिसेल की बरोबर उत्तर बरोबर का आहे.', '★ म्हणजे सुरक्षेचा प्रश्न. तो चुकला तर तुमचे ट्रेनर तुम्हाला कॉल करून त्यावर बोलतील.', 'यात पास किंवा नापास नाही. तुमची उत्तरे तुमचे ट्रेनर पाहतात. प्रत्येक उत्तर तुमच्या मॅन्युअलमध्ये आहे किंवा ट्रेनिंगमध्ये करून घेतले होते.'], closed: 'क्विझ 23 ऑक्टोबर रात्री 11:59 ला बंद झाली. कृपया तुमच्या ट्रेनरला मेसेज करा.',
    start: 'क्विझ सुरू करा', next: 'पुढचा प्रश्न', finish: 'माझा निकाल पाहा', timeLeft: 'उरलेला वेळ', qOf: 'प्रश्न {i} / {n}', right: 'बरोबर.', wrong: 'बरोबर उत्तर {L} आहे.', why: 'का', source: 'मॅन्युअल विभाग', star: 'सुरक्षेचा प्रश्न',
    doneTitle: 'क्विझ पूर्ण केल्याबद्दल शाब्बास.', timedOut: 'वेळ संपली.', score: 'तुमची {n} पैकी {s} उत्तरे बरोबर आहेत.', starAll: 'तुम्ही प्रत्येक ★ सुरक्षेचा प्रश्न बरोबर सोडवला.', starMissed: '★ सुरक्षेचे प्रश्न ज्यांवर ट्रेनरशी बोलायचे आहे: {list}. तुमचे ट्रेनर 2 दिवसांत तुम्हाला कॉल करतील.', learning: 'हा स्कोअर शिकण्यासाठी आहे, तुलना करण्यासाठी नाही.',
    taskTitle: 'अजून एक काम (गुण नाहीत, पण आवश्यक)', taskBtn: 'WhatsApp वर पाठवा', other: 'पुढे चला: {quiz}', already: 'तुम्ही ही क्विझ आधीच दिली आहे. हा तुमचा निकाल.', resume: 'पुन्हा स्वागत. तुमची क्विझ अजून चालू आहे.', errName: 'कृपया तुमचे नाव लिहा.', errPhone: 'कृपया 10 अंकी मोबाईल नंबर लिहा.', errQuiz: 'कृपया क्विझ निवडा.', errNet: 'कनेक्ट होऊ शकले नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.', errSrv: 'आत्ता क्विझ सेव्ह होऊ शकली नाही. कृपया तुमच्या ट्रेनरला सांगा, मग पुन्हा प्रयत्न करा.', retry: 'पुन्हा प्रयत्न करा', notAnswered: 'उत्तर दिले नाही', thanks: 'धन्यवाद. डोंगरात तुमच्यासोबत असणारे लोक तुम्हाला हे माहीत असण्यावर अवलंबून आहेत.', saving: 'सेव्ह होत आहे…', back: 'मागे' },
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
  return { id: rec.id, key: f[QA.key], quiz: +(Object.keys(QUIZZES).find((k) => QUIZZES[k].name === f[QA.quiz]) || 1), started: Date.parse(f[QA.started]), status: f[QA.status] || 'In progress', a, name: f[QA.name] || '' };
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
      const quiz = QUIZZES[b.quiz] ? +b.quiz : 0;
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
        if (Date.now() >= QUIZ_CLOSES) return qjson({ error: 'closed' }, 403);
        const now = new Date().toISOString();
        const rec = await qat(env, 'POST', '', { typecast: true, returnFieldsByFieldId: true, fields: { [QA.title]: `${name} · Quiz ${quiz}`, [QA.name]: name, [QA.phone]: phone, [QA.quiz]: QUIZZES[quiz].name, [QA.lang]: QUIZ_LANGS[lang], [QA.status]: 'In progress', [QA.started]: now, [QA.outOf]: QUIZZES[quiz].qs.length, [QA.data]: '{}', [QA.key]: qrand() } });
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
  for (const k of Object.keys(QUIZZES)) {
    const Q = QUIZZES[k];
    pub[k] = { title: Q.title, read: Q.read, task: Q.task, qs: Q.qs.map((q) => ({ star: q.star, img: q.img ? QUIZ_IMG[q.img] : '', en: { q: q.en.q, o: q.en.o }, hi: { q: q.hi.q, o: q.hi.o }, mr: { q: q.mr.q, o: q.mr.o }, hg: q.hg ? { q: q.hg.q, o: q.hg.o } : undefined })) };
  }
  const json = JSON.stringify({ quizzes: pub, ui: QUIZ_UI, minutes: QUIZ_MINUTES, wa: QUIZ_TRAINER_WA }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Post-Training Quiz | Rock &amp; Anchor</title><link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#f6f1e8"><style>${QUIZ_CSS}</style></head><body>
<header class="qz-top"><a href="/" aria-label="Rock &amp; Anchor home"><img src="/logo.png" alt="Rock &amp; Anchor" width="56" height="46"></a><div class="qz-lang" id="qz-lang" role="group" aria-label="Language"></div></header>
<main id="qz" aria-live="polite"><noscript><p class="qz-card">Please open this page in Chrome with JavaScript turned on.</p></noscript></main>
<script type="application/json" id="qz-data">${json}</script><script>${QUIZ_JS}</script></body></html>`;
}

const QUIZ_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('qz-data').textContent),root=document.getElementById('qz'),langBar=document.getElementById('qz-lang');
var L='ABCD',lang=ls('qz-lang')||'',S=null,cur=0,timer=null,skew=0,busy=false,pick={name:'',phone:'',quiz:0},msg='',showLast=null;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function t(k,r){var s=(D.ui[lang||'en']||D.ui.en)[k];if(r)for(var x in r)s=s.split('{'+x+'}').join(r[x]);return s}
var LANGS=['en','hi','mr','hg'];
function htmlLang(k){return k==='en'?'en-IN':k==='hg'?'hi-Latn':k}
function Q(){return D.quizzes[S.quiz]}
function nextQ(){var n=Object.keys(D.quizzes).length;return S.quiz%n+1}
function txt(q){return q[lang]||q.en}
// same shuffled answer order every time for this attempt (seeded by the attempt key)
function order(n){var seed=0,k=S.key+'|'+n;for(var i=0;i<k.length;i++)seed=(seed*31+k.charCodeAt(i))>>>0;var a=[0,1,2,3];for(var j=3;j>0;j--){seed=(seed*1103515245+12345)>>>0;var r=seed%(j+1);var tmp=a[j];a[j]=a[r];a[r]=tmp}return a}
function api(p,body){body.lang=lang||'en';return fetch('/quiz/api/'+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok){j=j||{};j.srv=1;throw j}return j})})}
function drawLang(){langBar.innerHTML=LANGS.map(function(k){return '<button type="button" data-lang="'+k+'" class="'+(lang===k?'on':'')+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('');langBar.hidden=!lang}
function setLang(k){lang=k;ls('qz-lang',k);document.documentElement.lang=htmlLang(k);drawLang();render()}
function mmss(ms){ms=Math.max(0,ms);var s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function left(){return S.deadline-(Date.now()+skew)}
function tick(){var el=document.getElementById('qz-time');if(!S||S.status!=='In progress'){clearInterval(timer);timer=null;return}var ms=left();if(el){el.textContent=mmss(ms);el.parentNode.classList.toggle('low',ms<120000)}if(ms<=0){clearInterval(timer);timer=null;finish()}}
function startTimer(){if(!timer)timer=setInterval(tick,500);tick()}
function firstOpen(){var n=Q().qs.length;for(var i=0;i<n;i++)if(!S.answered[i])return i;return n}
function load(j){S=j;skew=j.now-Date.now();if(S.status==='In progress'){ls('qz-att',JSON.stringify({id:S.id,key:S.key,quiz:S.quiz,phone:pick.phone,name:pick.name}));cur=Math.min(firstOpen(),Q().qs.length-1);if(firstOpen()<Q().qs.length&&S.answered[cur])cur=firstOpen();startTimer()}else{ls('qz-att',null)}render()}
function render(){
  if(!lang){root.innerHTML='<section class="qz-card qz-pick"><p class="qz-k">Rock &amp; Anchor</p><h1>Choose your language<br><span lang="hi">अपनी भाषा चुनें</span><br><span lang="mr">तुमची भाषा निवडा</span><br><span lang="hi-Latn">Apni bhasha chunein</span></h1><div class="qz-langs">'+LANGS.map(function(k){return '<button type="button" class="qz-big" data-lang="'+k+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('')+'</div></section>';return}
  if(!S){
    root.innerHTML='<section class="qz-card"><p class="qz-k">'+h(t('sub'))+'</p><h1>'+h(t('title'))+'</h1>'+(msg?'<p class="qz-err" role="alert">'+h(msg)+'</p>':'')+
    '<label class="qz-f"><span>'+h(t('name'))+'</span><input id="qz-name" autocomplete="name" value="'+h(pick.name)+'"></label>'+
    '<label class="qz-f"><span>'+h(t('phone'))+'</span><input id="qz-phone" type="tel" inputmode="numeric" maxlength="14" autocomplete="tel" value="'+h(pick.phone)+'"><small>'+h(t('phoneHint'))+'</small></label>'+
    '<p class="qz-f"><span>'+h(t('chooseQuiz'))+'</span></p><div class="qz-quizzes">'+Object.keys(D.quizzes).map(function(k){k=+k;var z=D.quizzes[k];return '<button type="button" class="qz-quiz'+(pick.quiz===k?' on':'')+'" data-quiz="'+k+'"><b>'+h(z.title[lang])+'</b><span>'+h(z.read[lang])+'</span></button>'}).join('')+'</div>'+
    '<div class="qz-rules"><h2>'+h(t('rulesTitle'))+'</h2><ul>'+t('rules').map(function(r){return '<li>'+h(r.split('{min}').join(D.minutes))+'</li>'}).join('')+'</ul></div>'+
    '<button type="button" class="qz-btn" data-start'+(busy?' disabled':'')+'>'+h(busy?t('saving'):t('start'))+'</button></section>';return}
  if(S.status!=='In progress'&&showLast===null){renderResult();return}
  var qs=Q().qs,n=qs.length,q=qs[cur],tx=txt(q),ord=order(cur),ans=S.answered[cur];
  var head='<div class="qz-bar"><div class="qz-timer"><span>'+h(t('timeLeft'))+'</span><b id="qz-time">'+mmss(left())+'</b></div><div class="qz-prog"><span>'+h(t('qOf',{i:cur+1,n:n}))+'</span><div class="qz-track"><i style="width:'+Math.round(Object.keys(S.answered).length/n*100)+'%"></i></div></div></div>';
  var body='<section class="qz-card qz-q">'+(q.star?'<p class="qz-star">★ '+h(t('star'))+'</p>':'')+'<h2>'+h(tx.q)+'</h2>'+(q.img?'<div class="qz-img">'+q.img+'</div>':'')+'<div class="qz-opts">'+ord.map(function(o,i){var cls='';if(ans){if(o===ans.correct)cls=' ok';else if(o===ans.c)cls=' bad';else cls=' dim'}return '<button type="button" class="qz-opt'+cls+'" data-o="'+o+'"'+(ans||busy?' disabled':'')+'><span class="qz-l">'+L[i]+'</span><span>'+h(tx.o[o])+'</span></button>'}).join('')+'</div>';
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
  var task=Q().task[lang];x+='<div class="qz-task"><h2>'+h(t('taskTitle'))+'</h2><p>'+h(task)+'</p><a class="qz-btn" href="https://wa.me/'+D.wa+'?text='+encodeURIComponent((pick.name?pick.name+': ':'')+Q().title[lang])+'" target="_blank" rel="noopener">'+h(t('taskBtn'))+'</a></div><p class="qz-thanks">'+h(t('thanks'))+'</p>'+'<button type="button" class="qz-btn qz-other" data-other>'+h(t('other',{quiz:D.quizzes[nextQ()].title[lang]}))+'</button></section>';
  root.innerHTML=x;
}
function finish(){if(!S||busy)return;busy=true;api('finish',{id:S.id,key:S.key}).then(function(j){busy=false;load(j)}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
function start(){
  var nm=(document.getElementById('qz-name')||{}).value||'',ph=((document.getElementById('qz-phone')||{}).value||'').replace(/\D/g,'').slice(-10);pick.name=nm.trim();pick.phone=ph;
  if(!pick.name){msg=t('errName');render();return}if(ph.length!==10){msg=t('errPhone');render();return}if(!pick.quiz){msg=t('errQuiz');render();return}
  msg='';busy=true;render();
  api('start',{name:pick.name,phone:ph,quiz:pick.quiz}).then(function(j){busy=false;if(!j.fresh&&j.status!=='In progress')j.already=1;load(j)}).catch(function(e){busy=false;msg=t(e&&e.error==='closed'?'closed':e&&e.srv?'errSrv':'errNet');render()});
}
function answer(o){if(busy||!S)return;var n=cur;busy=true;msg='';render();api('answer',{id:S.id,key:S.key,q:n,choice:o}).then(function(j){busy=false;var keep=n;if(j.status==='Finished'&&j.answered[keep])showLast=keep;load(j);if(S.status==='In progress'||showLast!==null){cur=keep;render()}}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.lang){setLang(b.dataset.lang);return}
  if(b.dataset.quiz){pick.quiz=+b.dataset.quiz;msg='';pick.name=(document.getElementById('qz-name')||{}).value||pick.name;pick.phone=(document.getElementById('qz-phone')||{}).value||pick.phone;render();return}
  if(b.hasAttribute('data-start')){start();return}
  if(b.dataset.o!==undefined){answer(+b.dataset.o);return}
  if(b.hasAttribute('data-next')){cur=firstOpen();render();window.scrollTo(0,0);return}
  if(b.hasAttribute('data-other')){var o=nextQ();S=null;showLast=null;cur=0;msg='';ls('qz-att',null);pick.quiz=o;render();window.scrollTo(0,0);return}
  if(b.hasAttribute('data-finish')){if(S&&S.status!=='In progress'){showLast=null;render();window.scrollTo(0,0)}else finish();return}
  if(b.hasAttribute('data-retry')){msg='';if(S&&S.status==='In progress'&&left()<=0){finish();return}render();return}
});
langBar.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.lang)setLang(b.dataset.lang)});
// resume an attempt on this device after a refresh
var saved=null;try{saved=JSON.parse(ls('qz-att')||'null')}catch(e){}
if(lang&&!D.ui[lang])lang='';if(lang){document.documentElement.lang=htmlLang(lang)}
drawLang();
if(saved&&saved.phone&&saved.name){pick={name:saved.name,phone:saved.phone,quiz:saved.quiz};busy=true;render();api('start',{name:saved.name,phone:saved.phone,quiz:saved.quiz}).then(function(j){busy=false;load(j)}).catch(function(){busy=false;render()})}else render();
})();`;

const QUIZ_CSS = `
:root{--ink:#221d19;--ink2:#4a423b;--muted:#776c62;--paper:#f6f1e8;--card:#fffdf9;--line:#e4dccf;--forest:#2c4535;--moss:#e7eee3;--clay:#b8612f;--clay2:#9c4f24;--ok:#2f6b3f;--bad:#a63d2a}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 "DM Sans","Noto Sans Devanagari",system-ui,sans-serif}
[lang=hi],[lang=mr],html[lang=hi] body,html[lang=mr] body{font-family:"Noto Sans Devanagari","DM Sans",system-ui,sans-serif}
.qz-top{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;height:68px;padding:0 16px;background:rgba(246,241,232,.92);-webkit-backdrop-filter:saturate(1.4) blur(10px);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.qz-top img{height:46px;width:auto;display:block}
.qz-lang{display:flex;gap:6px}.qz-lang[hidden]{display:none}
.qz-lang button{border:1.5px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}
@media(max-width:420px){.qz-lang{gap:4px}.qz-lang button{padding:5px 8px;font-size:13px}}
.qz-lang button.on{background:var(--forest);color:#fff;border-color:var(--forest);font-weight:700}
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
.qz-bar{position:sticky;top:68px;z-index:4;background:var(--paper);padding:8px 0;display:flex;gap:14px;align-items:center}
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
.qz-img{margin:0 0 14px}.qz-img svg{display:block;width:100%;height:auto;max-width:420px;margin:0 auto}
.qz-other{background:var(--forest)}
.qz-thanks{color:var(--ink2);text-align:center;margin-top:18px}
`;
