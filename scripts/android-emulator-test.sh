#!/usr/bin/env bash
set -eu
adb shell cmd connectivity airplane-mode enable
adb shell svc wifi disable
adb shell svc data disable
native_log=/tmp/sym-native-test.log
if (cd android && ./gradlew --no-daemon --console=plain :app:connectedDebugAndroidTest) >"$native_log" 2>&1; then
  cat "$native_log"
  exit 0
else
  native_status=$?
  cat "$native_log"
  python3 - <<'PY'
from pathlib import Path
import xml.etree.ElementTree as ET
messages=[]
for p in Path('android/app/build/outputs/androidTest-results').rglob('*.xml'):
    try:
        root=ET.parse(p).getroot()
        for case in root.iter('testcase'):
            for failure in list(case.findall('failure')) + list(case.findall('error')):
                messages.append(case.attrib.get('name','Native test') + ': ' + (failure.text or failure.attrib.get('message',''))[-5000:])
    except ET.ParseError:
        pass
if not messages:
    messages=[Path('/tmp/sym-native-test.log').read_text()[-7000:]]
for message in messages:
    print('::error title=Android native verification::' + message.replace('%','%25').replace('\r','%0D').replace('\n','%0A'))
PY
  exit "$native_status"
fi
