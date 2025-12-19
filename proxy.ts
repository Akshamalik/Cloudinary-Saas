import { clerkMiddleware ,createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute=createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/home",
    "/"
])

const isPublicApiRoute=createRouteMatcher([
    "/api/videos",
])
export default clerkMiddleware(async (auth,req)=>{
    const {userId}=await auth();
    const currentUrl=new URL(req.url)
    
    //Check the user accessing homepage
    const isAccessingDashboard= currentUrl.pathname=="/home"
    //Check the user calling api
    const isApiRequest=currentUrl.pathname.startsWith("/api")

    //the user is logged in accessing public routes but not accessing the dashboard then redirect him to home
    if(userId && isPublicRoute(req) && !isAccessingDashboard){
      return NextResponse.redirect(new URL("/home",req.url))
    }
    //not logged in 
    if(!userId){
      //if user not logged in and trying to access the protechted routes
      if(!isPublicRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
      }
      //if the user requests for the protected apu and user not logged in
      if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
      }
    }
})

export const config = {
  matcher: [
  "/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"
  ],
}