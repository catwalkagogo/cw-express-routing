import NPath = require('path');
import Enumerable = require('linq');

class Path {
	public static getFilenameWithoutExtension(path: string): string {
		return NPath.basename(path, NPath.extname(path));
	}

	public static split(path: string): string[] {
		return Enumerable
			.from(NPath.normalize(path).split(NPath.sep))
			.where(seg => seg != '')
			.toArray();
	}
}

export = Path;