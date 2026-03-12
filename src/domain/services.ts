import { StaticCardRepository } from "./cards/staticCardRepository";
import { LocalProgressRepository } from "./progress/localProgressRepository";
import { StaticAudioResolver } from "./audio/audioResolver";

export const cardRepository = new StaticCardRepository();
export const progressRepository = new LocalProgressRepository();
export const audioResolver = new StaticAudioResolver();
