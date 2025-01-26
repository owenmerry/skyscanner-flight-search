export interface GoogleRouteResponse {
  routes: Route[]
}

export interface Route {
  legs: Leg[]
  distanceMeters: number
  duration: string
}

export interface Leg {
  localizedValues: LocalizedValues
  stepsOverview: StepsOverview
}

export interface LocalizedValues {
  distance: Distance
  duration: Duration
  staticDuration: StaticDuration
}

export interface Distance {
  text: string
}

export interface Duration {
  text: string
}

export interface StaticDuration {
  text: string
}

export interface StepsOverview {
  multiModalSegments: MultiModalSegment[]
}

export interface MultiModalSegment {
  stepStartIndex: number
  stepEndIndex: number
  navigationInstruction?: NavigationInstruction
  travelMode: string
}

export interface NavigationInstruction {
  instructions: string
}
