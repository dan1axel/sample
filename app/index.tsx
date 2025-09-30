import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from "react";
import { Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import colors from "../shared/color";



export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()




export default function Index() {


const {isSignedIn} = useAuth()

const router  = useRouter()
const {user} = useUser()
console.log(user?.primaryEmailAddress?.emailAddress)

useEffect(() =>{
  if(isSignedIn){

  }
 },[isSignedIn]
)

 useWarmUpBrowser()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask)
              return
            }

            router.push('/')
          },
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: Platform.OS == "android" ? 40 : 30,
      }}
    >
      <Image source = {require("./../assets/images/Space-Background-Images.jpg")}
      style={{
        width: Dimensions.get("screen").width * 0.25,
        height: Dimensions.get("screen").width * 0.25,
      }}/>
      <Text

        style={{
          fontSize: 18,
          textAlign: "center",
          marginTop: 10,
          color: colors.text,
        }}>
        Edit app/index.tsx to edit this screen.</Text>

        <TouchableOpacity
        style={{
          marginTop: 20,
          width: "25%",
          padding: 15,
          backgroundColor: colors.primary,
          borderRadius: 5,
        }}

          onPress={onPress}>
          <Text
          style={{
            textAlign: "center", color: colors.text,
          }}>
            Get Started!

          </Text>
        </TouchableOpacity>
    </View>
  );
}
