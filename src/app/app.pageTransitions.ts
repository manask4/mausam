import { NativeTransitionOptions } from '@ionic-native/native-page-transitions';

export const PageTransitionOptions: NativeTransitionOptions = {
  direction: 'left',
  duration: 300,
  slowdownfactor: -1,
  slidePixels: 20,
  iosdelay: 100,
  androiddelay: 150,
  fixedPixelsTop: 0,
  fixedPixelsBottom: 60
};