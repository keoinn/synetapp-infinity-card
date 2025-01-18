<template>
  <div 
    v-show="!isLoading"
    class="text-center"
  >
    <v-progress-circular
      :model-value="processValue"
      :rotate="360"
      :size="100"
      :width="15"
      color="deep-orange-lighten-2"
    >
      <template #default>
        {{ processValue }} %
      </template>
    </v-progress-circular>
  </div>

  <img
    v-for="(image, index) in newImages"
    v-show="isLoading"
    :key="index"
    :src="image"
    :style="{ width: '100px' }"
    @load="handleLoad"
  >
</template>
<script setup>
import care001 from '@/assets/images/care001.webp'
import care002 from '@/assets/images/care002.webp'
import care003 from '@/assets/images/care003.webp'
import care004 from '@/assets/images/care004.webp'
import care005 from '@/assets/images/care005.webp'
import care006 from '@/assets/images/care006.webp'
import care007 from '@/assets/images/care007.webp'
import care008 from '@/assets/images/care008.webp'
import care009 from '@/assets/images/care009.webp'
import care010 from '@/assets/images/care010.webp'
import care011 from '@/assets/images/care011.webp'
import care012 from '@/assets/images/care012.webp'
import care013 from '@/assets/images/care013.webp'
import care014 from '@/assets/images/care014.webp'
import care015 from '@/assets/images/care015.webp'
import care016 from '@/assets/images/care016.webp'
import care017 from '@/assets/images/care017.webp'
import care018 from '@/assets/images/care018.webp'
import care019 from '@/assets/images/care019.webp'
import care020 from '@/assets/images/care020.webp'
import care021 from '@/assets/images/care021.webp'
import care022 from '@/assets/images/care022.webp'
import care023 from '@/assets/images/care023.webp'
import care024 from '@/assets/images/care024.webp'
import care025 from '@/assets/images/care025.webp'
import care026 from '@/assets/images/care026.webp'
import care027 from '@/assets/images/care027.webp'
import care028 from '@/assets/images/care028.webp'
import care029 from '@/assets/images/care029.webp'
import care030 from '@/assets/images/care030.webp'
import care031 from '@/assets/images/care031.webp'
import care032 from '@/assets/images/care032.webp'
import care033 from '@/assets/images/care033.webp'
import care034 from '@/assets/images/care034.webp'
import care035 from '@/assets/images/care035.webp'
import care036 from '@/assets/images/care036.webp'
import care037 from '@/assets/images/care037.webp'
import care038 from '@/assets/images/care038.webp'
import care039 from '@/assets/images/care039.webp'
import care040 from '@/assets/images/care040.webp'
import care041 from '@/assets/images/care041.webp'
import care042 from '@/assets/images/care042.webp'
import care043 from '@/assets/images/care043.webp'
import care044 from '@/assets/images/care044.webp'
import care045 from '@/assets/images/care045.webp'
import care046 from '@/assets/images/care046.webp'
import care047 from '@/assets/images/care047.webp'
import care048 from '@/assets/images/care048.webp'
import care049 from '@/assets/images/care049.webp'
import care050 from '@/assets/images/care050.webp'
import care051 from '@/assets/images/care051.webp'
import care052 from '@/assets/images/care052.webp'
import care053 from '@/assets/images/care053.webp'
import care054 from '@/assets/images/care054.webp'
import care055 from '@/assets/images/care055.webp'
import care056 from '@/assets/images/care056.webp'
import care057 from '@/assets/images/care057.webp'
import care058 from '@/assets/images/care058.webp'
import care059 from '@/assets/images/care059.webp'
import care060 from '@/assets/images/care060.webp'
import le001 from '@/assets/images/le001.webp'
import le002 from '@/assets/images/le002.webp'
import le003 from '@/assets/images/le003.webp'
import le004 from '@/assets/images/le004.webp'
import le005 from '@/assets/images/le005.webp'
import le006 from '@/assets/images/le006.webp'
import le007 from '@/assets/images/le007.webp'
import le008 from '@/assets/images/le008.webp'
import le009 from '@/assets/images/le009.webp'
import le010 from '@/assets/images/le010.webp'
import le011 from '@/assets/images/le011.webp'
import le012 from '@/assets/images/le012.webp'
import le013 from '@/assets/images/le013.webp'
import le014 from '@/assets/images/le014.webp'
import le015 from '@/assets/images/le015.webp'
import le016 from '@/assets/images/le016.webp'
import le017 from '@/assets/images/le017.webp'
import le018 from '@/assets/images/le018.webp'
import le019 from '@/assets/images/le019.webp'
import le020 from '@/assets/images/le020.webp'
import le021 from '@/assets/images/le021.webp'
import le022 from '@/assets/images/le022.webp'
import le023 from '@/assets/images/le023.webp'
import le024 from '@/assets/images/le024.webp'
import le025 from '@/assets/images/le025.webp'
import le026 from '@/assets/images/le026.webp'
import le027 from '@/assets/images/le027.webp'
import le028 from '@/assets/images/le028.webp'
import le029 from '@/assets/images/le029.webp'
import le030 from '@/assets/images/le030.webp'
import le031 from '@/assets/images/le031.webp'
import le032 from '@/assets/images/le032.webp'
import le033 from '@/assets/images/le033.webp'
import le034 from '@/assets/images/le034.webp'
import le035 from '@/assets/images/le035.webp'
import le036 from '@/assets/images/le036.webp'
import le037 from '@/assets/images/le037.webp'
import le038 from '@/assets/images/le038.webp'
import le039 from '@/assets/images/le039.webp'
import le040 from '@/assets/images/le040.webp'
import le041 from '@/assets/images/le041.webp'
import le042 from '@/assets/images/le042.webp'
import le043 from '@/assets/images/le043.webp'
import le044 from '@/assets/images/le044.webp'
import le045 from '@/assets/images/le045.webp'
import le046 from '@/assets/images/le046.webp'
import le047 from '@/assets/images/le047.webp'
import le048 from '@/assets/images/le048.webp'
import le049 from '@/assets/images/le049.webp'
import le050 from '@/assets/images/le050.webp'
import le051 from '@/assets/images/le051.webp'
import le052 from '@/assets/images/le052.webp'
import le053 from '@/assets/images/le053.webp'
import le054 from '@/assets/images/le054.webp'
import le055 from '@/assets/images/le055.webp'
import le056 from '@/assets/images/le056.webp'
import le057 from '@/assets/images/le057.webp'
import le058 from '@/assets/images/le058.webp'
import le059 from '@/assets/images/le059.webp'
import le060 from '@/assets/images/le060.webp'
import lj001 from '@/assets/images/lj001.webp'
import lj002 from '@/assets/images/lj002.webp'
import lj003 from '@/assets/images/lj003.webp'
import lj004 from '@/assets/images/lj004.webp'
import lj005 from '@/assets/images/lj005.webp'
import lj006 from '@/assets/images/lj006.webp'
import lj007 from '@/assets/images/lj007.webp'
import lj008 from '@/assets/images/lj008.webp'
import lj009 from '@/assets/images/lj009.webp'
import lj010 from '@/assets/images/lj010.webp'
import lj011 from '@/assets/images/lj011.webp'
import lj012 from '@/assets/images/lj012.webp'
import lj013 from '@/assets/images/lj013.webp'
import lj014 from '@/assets/images/lj014.webp'
import lj015 from '@/assets/images/lj015.webp'
import lj016 from '@/assets/images/lj016.webp'
import lj017 from '@/assets/images/lj017.webp'
import lj018 from '@/assets/images/lj018.webp'
import lj019 from '@/assets/images/lj019.webp'
import lj020 from '@/assets/images/lj020.webp'
import lj021 from '@/assets/images/lj021.webp'
import lj022 from '@/assets/images/lj022.webp'
import lj023 from '@/assets/images/lj023.webp'
import lj024 from '@/assets/images/lj024.webp'
import lj025 from '@/assets/images/lj025.webp'
import lj026 from '@/assets/images/lj026.webp'
import lj027 from '@/assets/images/lj027.webp'
import lj028 from '@/assets/images/lj028.webp'
import lj029 from '@/assets/images/lj029.webp'
import lj030 from '@/assets/images/lj030.webp'
import lj031 from '@/assets/images/lj031.webp'
import lj032 from '@/assets/images/lj032.webp'
import lj033 from '@/assets/images/lj033.webp'
import lj034 from '@/assets/images/lj034.webp'
import lj035 from '@/assets/images/lj035.webp'
import lj036 from '@/assets/images/lj036.webp'
import lj037 from '@/assets/images/lj037.webp'
import lj038 from '@/assets/images/lj038.webp'
import lj039 from '@/assets/images/lj039.webp'
import lj040 from '@/assets/images/lj040.webp'
import lj041 from '@/assets/images/lj041.webp'
import lj042 from '@/assets/images/lj042.webp'
import lj043 from '@/assets/images/lj043.webp'
import lj044 from '@/assets/images/lj044.webp'
import lj045 from '@/assets/images/lj045.webp'
import lj046 from '@/assets/images/lj046.webp'
import lj047 from '@/assets/images/lj047.webp'
import lj048 from '@/assets/images/lj048.webp'
import lj049 from '@/assets/images/lj049.webp'
import lj050 from '@/assets/images/lj050.webp'
import lj051 from '@/assets/images/lj051.webp'
import lj052 from '@/assets/images/lj052.webp'
import lj053 from '@/assets/images/lj053.webp'
import lj054 from '@/assets/images/lj054.webp'
import lj055 from '@/assets/images/lj055.webp'
import lj056 from '@/assets/images/lj056.webp'
import lj057 from '@/assets/images/lj057.webp'
import lj058 from '@/assets/images/lj058.webp'
import lj059 from '@/assets/images/lj059.webp'
import lj060 from '@/assets/images/lj060.webp'
import ce001 from '@/assets/images/ce001.webp'
import ce002 from '@/assets/images/ce002.webp'
import ce003 from '@/assets/images/ce003.webp'
import ce004 from '@/assets/images/ce004.webp'
import ce005 from '@/assets/images/ce005.webp'
import ce006 from '@/assets/images/ce006.webp'
import ce007 from '@/assets/images/ce007.webp'
import ce008 from '@/assets/images/ce008.webp'
import ce009 from '@/assets/images/ce009.webp'
import ce010 from '@/assets/images/ce010.webp'
import ce011 from '@/assets/images/ce011.webp'
import ce012 from '@/assets/images/ce012.webp'
import ce013 from '@/assets/images/ce013.webp'
import ce014 from '@/assets/images/ce014.webp'
import ce015 from '@/assets/images/ce015.webp'
import ce016 from '@/assets/images/ce016.webp'
import ce017 from '@/assets/images/ce017.webp'
import ce018 from '@/assets/images/ce018.webp'
import ce019 from '@/assets/images/ce019.webp'
import ce020 from '@/assets/images/ce020.webp'
import ce021 from '@/assets/images/ce021.webp'
import ce022 from '@/assets/images/ce022.webp'
import ce023 from '@/assets/images/ce023.webp'
import ce024 from '@/assets/images/ce024.webp'
import ce025 from '@/assets/images/ce025.webp'
import ce026 from '@/assets/images/ce026.webp'
import ce027 from '@/assets/images/ce027.webp'
import ce028 from '@/assets/images/ce028.webp'
import ce029 from '@/assets/images/ce029.webp'
import ce030 from '@/assets/images/ce030.webp'
import ce031 from '@/assets/images/ce031.webp'
import ce032 from '@/assets/images/ce032.webp'
import ce033 from '@/assets/images/ce033.webp'
import ce034 from '@/assets/images/ce034.webp'
import ce035 from '@/assets/images/ce035.webp'
import ce036 from '@/assets/images/ce036.webp'
import ce037 from '@/assets/images/ce037.webp'
import ce038 from '@/assets/images/ce038.webp'
import ce039 from '@/assets/images/ce039.webp'
import ce040 from '@/assets/images/ce040.webp'
import ce041 from '@/assets/images/ce041.webp'
import ce042 from '@/assets/images/ce042.webp'
import ce043 from '@/assets/images/ce043.webp'
import ce044 from '@/assets/images/ce044.webp'
import ce045 from '@/assets/images/ce045.webp'
import ce046 from '@/assets/images/ce046.webp'
import ce047 from '@/assets/images/ce047.webp'
import ce048 from '@/assets/images/ce048.webp'
import ce049 from '@/assets/images/ce049.webp'
import ce050 from '@/assets/images/ce050.webp'
import ce051 from '@/assets/images/ce051.webp'
import ce052 from '@/assets/images/ce052.webp'
import ce053 from '@/assets/images/ce053.webp'
import ce054 from '@/assets/images/ce054.webp'
import ce055 from '@/assets/images/ce055.webp'
import ce056 from '@/assets/images/ce056.webp'
import ce057 from '@/assets/images/ce057.webp'
import ce058 from '@/assets/images/ce058.webp'
import ce059 from '@/assets/images/ce059.webp'
import ce060 from '@/assets/images/ce060.webp'
import cj001 from '@/assets/images/cj001.webp'
import cj002 from '@/assets/images/cj002.webp'
import cj003 from '@/assets/images/cj003.webp'
import cj004 from '@/assets/images/cj004.webp'
import cj005 from '@/assets/images/cj005.webp'
import cj006 from '@/assets/images/cj006.webp'
import cj007 from '@/assets/images/cj007.webp'
import cj008 from '@/assets/images/cj008.webp'
import cj009 from '@/assets/images/cj009.webp'
import cj010 from '@/assets/images/cj010.webp'
import cj011 from '@/assets/images/cj011.webp'
import cj012 from '@/assets/images/cj012.webp'
import cj013 from '@/assets/images/cj013.webp'
import cj014 from '@/assets/images/cj014.webp'
import cj015 from '@/assets/images/cj015.webp'
import cj016 from '@/assets/images/cj016.webp'
import cj017 from '@/assets/images/cj017.webp'
import cj018 from '@/assets/images/cj018.webp'
import cj019 from '@/assets/images/cj019.webp'
import cj020 from '@/assets/images/cj020.webp'
import cj021 from '@/assets/images/cj021.webp'
import cj022 from '@/assets/images/cj022.webp'
import cj023 from '@/assets/images/cj023.webp'
import cj024 from '@/assets/images/cj024.webp'
import cj025 from '@/assets/images/cj025.webp'
import cj026 from '@/assets/images/cj026.webp'
import cj027 from '@/assets/images/cj027.webp'
import cj028 from '@/assets/images/cj028.webp'
import cj029 from '@/assets/images/cj029.webp'
import cj030 from '@/assets/images/cj030.webp'
import cj031 from '@/assets/images/cj031.webp'
import cj032 from '@/assets/images/cj032.webp'
import cj033 from '@/assets/images/cj033.webp'
import cj034 from '@/assets/images/cj034.webp'
import cj035 from '@/assets/images/cj035.webp'
import cj036 from '@/assets/images/cj036.webp'
import cj037 from '@/assets/images/cj037.webp'
import cj038 from '@/assets/images/cj038.webp'
import cj039 from '@/assets/images/cj039.webp'
import cj040 from '@/assets/images/cj040.webp'
import cj041 from '@/assets/images/cj041.webp'
import cj042 from '@/assets/images/cj042.webp'
import cj043 from '@/assets/images/cj043.webp'
import cj044 from '@/assets/images/cj044.webp'
import cj045 from '@/assets/images/cj045.webp'
import cj046 from '@/assets/images/cj046.webp'
import cj047 from '@/assets/images/cj047.webp'
import cj048 from '@/assets/images/cj048.webp'
import cj049 from '@/assets/images/cj049.webp'
import cj050 from '@/assets/images/cj050.webp'
import cj051 from '@/assets/images/cj051.webp'
import cj052 from '@/assets/images/cj052.webp'
import cj053 from '@/assets/images/cj053.webp'
import cj054 from '@/assets/images/cj054.webp'
import cj055 from '@/assets/images/cj055.webp'
import cj056 from '@/assets/images/cj056.webp'
import cj057 from '@/assets/images/cj057.webp'
import cj058 from '@/assets/images/cj058.webp'
import cj059 from '@/assets/images/cj059.webp'
import cj060 from '@/assets/images/cj060.webp'
import goal001 from '@/assets/images/goal001.webp'
import goal002 from '@/assets/images/goal002.webp'
import goal003 from '@/assets/images/goal003.webp'
import goal004 from '@/assets/images/goal004.webp'
import goal005 from '@/assets/images/goal005.webp'
import goal006 from '@/assets/images/goal006.webp'
import goal007 from '@/assets/images/goal007.webp'
import goal008 from '@/assets/images/goal008.webp'
import goal009 from '@/assets/images/goal009.webp'
import goal010 from '@/assets/images/goal010.webp'
import goal011 from '@/assets/images/goal011.webp'
import goal012 from '@/assets/images/goal012.webp'
import goal013 from '@/assets/images/goal013.webp'
import goal014 from '@/assets/images/goal014.webp'
import goal015 from '@/assets/images/goal015.webp'
import goal016 from '@/assets/images/goal016.webp'
import goal017 from '@/assets/images/goal017.webp'
import goal018 from '@/assets/images/goal018.webp'
import goal019 from '@/assets/images/goal019.webp'
import goal020 from '@/assets/images/goal020.webp'
import goal021 from '@/assets/images/goal021.webp'
import goal022 from '@/assets/images/goal022.webp'
import goal023 from '@/assets/images/goal023.webp'
import goal024 from '@/assets/images/goal024.webp'
import goal025 from '@/assets/images/goal025.webp'
import goal026 from '@/assets/images/goal026.webp'
import goal027 from '@/assets/images/goal027.webp'
import goal028 from '@/assets/images/goal028.webp'
import goal029 from '@/assets/images/goal029.webp'
import goal030 from '@/assets/images/goal030.webp'
import goal031 from '@/assets/images/goal031.webp'
import goal032 from '@/assets/images/goal032.webp'
import goal033 from '@/assets/images/goal033.webp'
import goal034 from '@/assets/images/goal034.webp'
import goal035 from '@/assets/images/goal035.webp'
import goal036 from '@/assets/images/goal036.webp'
import goal037 from '@/assets/images/goal037.webp'
import goal038 from '@/assets/images/goal038.webp'
import goal039 from '@/assets/images/goal039.webp'
import goal040 from '@/assets/images/goal040.webp'
import goal041 from '@/assets/images/goal041.webp'
import goal042 from '@/assets/images/goal042.webp'
import goal043 from '@/assets/images/goal043.webp'
import goal044 from '@/assets/images/goal044.webp'
import goal045 from '@/assets/images/goal045.webp'
import goal046 from '@/assets/images/goal046.webp'
import goal047 from '@/assets/images/goal047.webp'
import goal048 from '@/assets/images/goal048.webp'
import goal049 from '@/assets/images/goal049.webp'
import goal050 from '@/assets/images/goal050.webp'
import goal051 from '@/assets/images/goal051.webp'
import goal052 from '@/assets/images/goal052.webp'
import goal053 from '@/assets/images/goal053.webp'
import goal054 from '@/assets/images/goal054.webp'
import goal055 from '@/assets/images/goal055.webp'
import goal056 from '@/assets/images/goal056.webp'
import goal057 from '@/assets/images/goal057.webp'
import goal058 from '@/assets/images/goal058.webp'
import goal059 from '@/assets/images/goal059.webp'
import goal060 from '@/assets/images/goal060.webp'
import goal061 from '@/assets/images/goal061.webp'
import goal062 from '@/assets/images/goal062.webp'
import goal063 from '@/assets/images/goal063.webp'
import goal064 from '@/assets/images/goal064.webp'
import goal065 from '@/assets/images/goal065.webp'
import goal066 from '@/assets/images/goal066.webp'
import goal067 from '@/assets/images/goal067.webp'
import goal068 from '@/assets/images/goal068.webp'
import goal069 from '@/assets/images/goal069.webp'
import goal070 from '@/assets/images/goal070.webp'
import goal071 from '@/assets/images/goal071.webp'
import goal072 from '@/assets/images/goal072.webp'
import goal073 from '@/assets/images/goal073.webp'
import goal074 from '@/assets/images/goal074.webp'
import goal075 from '@/assets/images/goal075.webp'
import goal076 from '@/assets/images/goal076.webp'
import goal077 from '@/assets/images/goal077.webp'
import goal078 from '@/assets/images/goal078.webp'
import goal079 from '@/assets/images/goal079.webp'
import goal080 from '@/assets/images/goal080.webp'
import goal081 from '@/assets/images/goal081.webp'
import goal082 from '@/assets/images/goal082.webp'
import goal083 from '@/assets/images/goal083.webp'
import goal084 from '@/assets/images/goal084.webp'
import goal085 from '@/assets/images/goal085.webp'
import goal086 from '@/assets/images/goal086.webp'
import goal087 from '@/assets/images/goal087.webp'
import goal088 from '@/assets/images/goal088.webp'
import goal089 from '@/assets/images/goal089.webp'
import goal090 from '@/assets/images/goal090.webp'
import goal091 from '@/assets/images/goal091.webp'
import goal092 from '@/assets/images/goal092.webp'
import goal093 from '@/assets/images/goal093.webp'
import goal094 from '@/assets/images/goal094.webp'
import goal095 from '@/assets/images/goal095.webp'
import goal096 from '@/assets/images/goal096.webp'
import goal097 from '@/assets/images/goal097.webp'
import goal098 from '@/assets/images/goal098.webp'
import goal099 from '@/assets/images/goal099.webp'
import goal100 from '@/assets/images/goal100.webp'

const careImages = [
  care001, care002, care003, care004, care005, care006, care007, care008, care009, care010, care011, care012, care013, care014, care015, care016, care017, care018, care019, care020, care021, care022, care023, care024, care025, care026, care027, care028, care029, care030, care031, care032, care033, care034, care035, care036, care037, care038, care039, care040, care041, care042, care043, care044, care045, care046, care047, care048, care049, care050, care051, care052, care053, care054, care055, care056, care057, care058, care059, care060,
]

const leImages = [
  le001, le002, le003, le004, le005, le006, le007, le008, le009, le010, le011, le012, le013, le014, le015, le016, le017, le018, le019, le020, le021, le022, le023, le024, le025, le026, le027, le028, le029, le030, le031, le032, le033, le034, le035, le036, le037, le038, le039, le040, le041, le042, le043, le044, le045, le046, le047, le048, le049, le050, le051, le052, le053, le054, le055, le056, le057, le058, le059, le060,
]

const ljImages = [
  lj001, lj002, lj003, lj004, lj005, lj006, lj007, lj008, lj009, lj010, lj011, lj012, lj013, lj014, lj015, lj016, lj017, lj018, lj019, lj020, lj021, lj022, lj023, lj024, lj025, lj026, lj027, lj028, lj029, lj030, lj031, lj032, lj033, lj034, lj035, lj036, lj037, lj038, lj039, lj040, lj041, lj042, lj043, lj044, lj045, lj046, lj047, lj048, lj049, lj050, lj051, lj052, lj053, lj054, lj055, lj056, lj057, lj058, lj059, lj060,
]

const ceImages = [
  ce001, ce002, ce003, ce004, ce005, ce006, ce007, ce008, ce009, ce010, ce011, ce012, ce013, ce014, ce015, ce016, ce017, ce018, ce019, ce020, ce021, ce022, ce023, ce024, ce025, ce026, ce027, ce028, ce029, ce030, ce031, ce032, ce033, ce034, ce035, ce036, ce037, ce038, ce039, ce040, ce041, ce042, ce043, ce044, ce045, ce046, ce047, ce048, ce049, ce050, ce051, ce052, ce053, ce054, ce055, ce056, ce057, ce058, ce059, ce060,
]

const cjImages = [
  cj001, cj002, cj003, cj004, cj005, cj006, cj007, cj008, cj009, cj010, cj011, cj012, cj013, cj014, cj015, cj016, cj017, cj018, cj019, cj020, cj021, cj022, cj023, cj024, cj025, cj026, cj027, cj028, cj029, cj030, cj031, cj032, cj033, cj034, cj035, cj036, cj037, cj038, cj039, cj040, cj041, cj042, cj043, cj044, cj045, cj046, cj047, cj048, cj049, cj050, cj051, cj052, cj053, cj054, cj055, cj056, cj057, cj058, cj059, cj060,
]

const goalImages = [
  goal001, goal002, goal003, goal004, goal005, goal006, goal007, goal008, goal009, goal010, goal011, goal012, goal013, goal014, goal015, goal016, goal017, goal018, goal019, goal020, goal021, goal022, goal023, goal024, goal025, goal026, goal027, goal028, goal029, goal030, goal031, goal032, goal033, goal034, goal035, goal036, goal037, goal038, goal039, goal040, goal041, goal042, goal043, goal044, goal045, goal046, goal047, goal048, goal049, goal050, goal051, goal052, goal053, goal054, goal055, goal056, goal057, goal058, goal059, goal060, goal061, goal062, goal063, goal064, goal065, goal066, goal067, goal068, goal069, goal070, goal071, goal072, goal073, goal074, goal075, goal076, goal077, goal078, goal079, goal080, goal081, goal082, goal083, goal084, goal085, goal086, goal087, goal088, goal089, goal090, goal091, goal092, goal093, goal094, goal095, goal096, goal097, goal098, goal099, goal100,
]

import { ref, onMounted, computed, watch} from 'vue'

const images = [...careImages, ...leImages, ...ljImages, ...ceImages, ...cjImages, ...goalImages]
const newImages = ref([])
const loaded = ref(0)
const isLoading = ref(false)

const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = resolve
        img.onerror = reject
      })
    })
  )
}

const handleLoad = () => {
  setTimeout(() => {
    loaded.value++
  }, 100)
}

const processValue = computed(() => {
  return Math.round((loaded.value / images.length) * 100)
})

watch(()=>processValue.value, (value) => {
  if (value === 100) {
    setTimeout(() => {
      isLoading.value = true
    }, 500)
  }
})

onMounted(async () => {
  await preloadImages(images)
  newImages.value = images
})
</script>

<style scoped lang="scss">
.v-progress-circular {
  position: fixed;
  top: 30%;
  left: 50%;
  z-index: 1000;
}
</style>
