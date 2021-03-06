import { mergeFs } from '@sitecore-jss/sitecore-jss-dev-tools';

const convertToRoutes = ({ data, language }) => {
  let result;

  const filename = `${language}.json`.toUpperCase();
  const file = data.files.find((f) => f.filename.toUpperCase() === filename);

  if (file && file.contents) {
    result = file.contents;
  } else {
    console.warn(`route data file not found: ${filename}`, data.path);
  }

  if (result && data.folders.length > 0) {
    result.children = data.folders
      .map((folder) => convertToRoutes({ data: folder, language }))
      .filter((route) => route); // remove null results
  }

  return result;
};

export default (manifest) => {
  // path is relative to process invocation (i.e. where you call `npm run generate-manifest`)
  return mergeFs('./data/routes')
    .then((result) => {
      const routeData = convertToRoutes({ data: result, language: manifest.language });
      return routeData;
    })
    .then((routeData) => {
      manifest.addRoute(routeData);
    });
};
