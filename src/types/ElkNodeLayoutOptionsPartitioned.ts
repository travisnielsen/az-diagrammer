import { ElkNodeLayoutOptions } from 'reaflow'

export interface ElkNodeLayoutOptionsPartitioned extends ElkNodeLayoutOptions {
    'partitioning.partition': string;
}

/*
type ElkNodeLayoutOptionsPartitioned = Omit<ElkNodeLayoutOptions, "portConstraints" | "elk.padding" | "elk.direction"> & {
    'partitioning.partition': string;
}
*/