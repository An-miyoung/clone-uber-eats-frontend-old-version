import React, { useCallback, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDERS_FRAGMENTS } from "../../new-fragments";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDERS_FRAGMENTS}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

const Driver: React.FC<IDriverProps> = (lat, lng) => {
  return <div className="text-2xl"> 🏎</div>;
};

const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const history = useHistory();

  const defaultProps = {
    center: {
      lat: 37.498,
      lng: 127.1,
    },
    zoom: 15,
  };

  const onSuccess = ({ coords: { latitude, longitude } }: any) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: any) => {
    console.log(error);
  };

  const handleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setMap(map);
    setMaps(maps);
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  const makeRoute = useCallback(() => {
    if (!map) return;
    const directionService = new google.maps.DirectionsService();
    const directionRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "red",
      },
    });
    directionRenderer.setMap(map);
    directionService.route(
      {
        origin: {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        destination: {
          location: new google.maps.LatLng(
            driverCoords.lat + 0.05,
            driverCoords.lng + 0.05
          ),
        },
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result) => {
        directionRenderer.setDirections(result);
      }
    );
  }, [driverCoords.lat, driverCoords.lng, map]);

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDER_SUBSCRIPTION
  );

  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    { onCompleted }
  );

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // const geoCoder = new google.maps.Geocoder();
      // geoCoder.geocode(
      //   {
      //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //   },
      //   (result, status) => {
      //     console.log(status, result);
      //   }
      // );
    }
  }, [driverCoords, map, maps]);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData, makeRoute]);

  return (
    <div>
      <div
        className=" overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          onGoogleApiLoaded={handleApiLoaded}
          yesIWantToUseGoogleMapApiInternals
          defaultZoom={defaultProps.zoom}
          defaultCenter={defaultProps.center}
          bootstrapURLKeys={{ key: "AIzaSyDD5YnbgZtuGyXoBiBhybuImTTCa2bIOqs" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className=" text-center text-2xl font-medium">
              새로운 배달요청
            </h1>
            <h1 className=" text-center text-xl font-medium mt-2">
              빨리 클릭하세요 @ {cookedOrdersData.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full bg-lime-600 mt-4 text-xl font-medium"
            >
              수락 &rarr;
            </button>
          </>
        ) : (
          <h1 className=" text-center text-2xl font-medium">
            새로운 배달요청이 없습니다.
          </h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
