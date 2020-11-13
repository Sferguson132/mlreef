import ProjectGeneralInfoApi from 'apis/ProjectGeneralInfoApi';
import assureUserRegistration from './fixtures/testHelpers';

const projectApi = new ProjectGeneralInfoApi();

beforeAll(async () => {
  // ----------- login with the user ----------- //
  await assureUserRegistration();
});

describe('Authenticated user', () => {
  test('Can get public projects ', async () => {
    jest.setTimeout(30000);

    const projects = await projectApi.getProjectsList('/public');
    expect(projects.length > 0).toBe(true);
  });

  let projectUUID;
  test('Can create project', async () => {
    const request = {
      name: 'Can get Project Info',
      slug: 'can-get-project-info',
      namespace: '',
      initialize_with_readme: false,
      description: '',
      visibility: 'private',
      input_data_types: [],
    };

    const response = await projectApi.create(request, 'data-project', false)
      .catch((err) => {
        expect(true).not.toBe(true);
        return err;
      });

    expect(response.name).toBe(request.name);
    expect(response.slug).toBe(request.slug);

    projectUUID = response.id;
  });

  test('Can fork own project ', async () => {
    const request = {
      target_namespace_gitlab_id: -1, // "null" implies forking to user's private namespace
      target_name: 'New Name', // If null, defaults to original name
      target_path: 'new-path', // If null, defaults to original path - needs to be set when forking within the same namespace
    };
    console.log(`Running forking test against id: ${projectUUID}. Request: ${JSON.stringify(request)}`);
    const response = await projectApi.fork(projectUUID, request, false)
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });

    expect(response.name).toBe(request.target_name);
    expect('new-path').toBe(request.target_path);
  });
});
