import {Circuit} from "./circuit";

export class Panel {
    constructor(
        public panel_name: string,
        public building_id: string,
        public panel_id: string,
        public panel_type: string,
        public panel_voltage: string,
        public panel_image: string,
        public panel_circuits: Circuit[]
    ) {

    }

}