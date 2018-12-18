import * as React from 'react';
import { LocationState } from '../../redux/location/reducer';
import { clearAddress, setLocation } from '../../redux/location';
import { store } from '../../redux/store';
import { getBrowserGeolocation } from '../../services/geolocationServices';
import { getContactsIfNeeded } from '../../redux/remoteData/asyncActionCreator';

interface Props {
  locationState: LocationState;
}

// this will be needed
interface State {
  uiState: LocationUIState;
  triedAutoLocation: boolean;
}

export enum LocationUIState {
  NO_LOCATION = 'NO_LOCATION',
  FETCHING_LOCATION = 'FETCHING_LOCATION',
  ENTERING_LOCATION = 'ENTERING_LOCATION',
  LOCATION_FOUND = 'LOCATION_FOUND',
  LOCATION_ERROR = 'LOCATION_ERROR'
}

export class Location extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // set initial state

    this.state = {
      uiState: LocationUIState.NO_LOCATION,
      triedAutoLocation: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.locationState.address === '' &&
      this.props.locationState.address !== ''
    ) {
      this.setState({ uiState: LocationUIState.LOCATION_FOUND });

      // if the location has updated, force a contact refresh
      if (
        prevProps.locationState.address !== this.props.locationState.address
      ) {
        getContactsIfNeeded(true);
      }
    }
  }

  componentDidMount() {
    switch (this.state.uiState) {
      case LocationUIState.NO_LOCATION:
        // if there's a saved location, set it
        if (
          this.props.locationState.address &&
          this.props.locationState.address !== ''
        ) {
          this.setState({ uiState: LocationUIState.LOCATION_FOUND });
        }
        break;
      default:
        break;
    }
  }

  fetchLocation() {
    this.setState({ uiState: LocationUIState.FETCHING_LOCATION });

    getBrowserGeolocation()
      .then(loc => {
        store.dispatch(setLocation(loc.latitude + ',' + loc.longitude));
      })
      .catch(err => {
        // ok, go to manual entry
        this.setState({ uiState: LocationUIState.ENTERING_LOCATION });
      });
  }

  enterLocation(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    store.dispatch(clearAddress());

    // see if browser supports location
    let browserSupportsLocation = 'geolocation' in navigator;
    if (browserSupportsLocation && this.state.triedAutoLocation === false) {
      this.setState({ triedAutoLocation: true });
      this.fetchLocation();
    } else {
      // go to manual entrys
      this.setState({ uiState: LocationUIState.ENTERING_LOCATION });
    }
  }

  submitLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // tslint:disable-next-line:no-string-literal
    const newLocation = e.currentTarget.elements['address'].value;

    if (newLocation === '') {
      // tslint:disable-next-line:no-console
      console.error('not the right behavior anymore');
      // if the user hits "Go" with no location, clear what they had and refresh to try the default again
      store.dispatch(clearAddress());
      window.location.reload();
    } else {
      store.dispatch(setLocation(newLocation));
    }
  }

  // --- each location state is below

  noLocation() {
    return (
      <>
        <p>Set your location</p>
        <button onClick={e => this.enterLocation(e)}>Set Location</button>
      </>
    );
  }

  findingLocation() {
    return (
      <>
        <p className="loadingAnimation">
          Getting your location automatically...
        </p>
        <p className="help">
          <a href="#">Or enter an address manually</a>
        </p>
      </>
    );
  }

  enteringLocation() {
    return (
      <>
        <p>Set your location</p>
        <form onSubmit={this.submitLocation}>
          <input
            type="text"
            autoFocus={true}
            id="address"
            name="address"
            placeholder="Enter an address or zip code"
          />
          <button>Go</button>
        </form>
      </>
    );
  }

  locationFound() {
    return (
      <>
        <p id="locationMessage">
          Your location: <span>{this.props.locationState.cachedCity}</span>
        </p>
        <button onClick={e => this.enterLocation(e)}>Change Location</button>
      </>
    );
  }

  render() {
    return (
      <div className="location">
        {(() => {
          switch (this.state.uiState) {
            case LocationUIState.NO_LOCATION:
              return this.noLocation();
            case LocationUIState.LOCATION_ERROR:
              return <h1>error lol</h1>;
            case LocationUIState.LOCATION_FOUND:
              return this.locationFound();
            case LocationUIState.FETCHING_LOCATION:
              return this.findingLocation();
            case LocationUIState.ENTERING_LOCATION:
              return this.enteringLocation();
            default:
              return <>no state for {this.state.uiState}</>;
          }
        })()}
      </div>
    );
  }
}
