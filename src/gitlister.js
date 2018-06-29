import React, { Component } from 'react';
import Header from './header';
import Tables from './tables';
import parse from 'parse-link-header';

class GitLister extends Component {

  constructor(props){
      super(props);

      this.state = {
        loading: false,
        showError: false,
        repoList: [],
        repoContributors: {},
        compiledContributors: []
      };
  }

  submit = (org, token) => {
    this.org = org;
    this.token = token;
    this.setState({
      loading: true,
      showError: false,
      repoList: [],
      repoContributors: {},
      compiledContributors: []
    });

    this.getFullList(`https://api.github.com/orgs/${org}/repos`).then( (repos) => {
      return this.setState({ repoList: repos})
    }).then(this.getContributors)//wait till all repo requests are done before compiling contributors
    .then(this.compileContributors).then(() => {
      this.setState({
        loading: false
      })
    });

  }


  compileContributors = () => {
    const totals = {};
    for(let repo in this.state.repoContributors){
      for(let idx in this.state.repoContributors[repo]){
        let contributor = this.state.repoContributors[repo][idx];
        let name = contributor.login;

        if(totals[name]){
          totals[name] += contributor.contributions;
        }else{
          totals[name] = contributor.contributions;
        }
      }
    }

    const contList =  Object.keys(totals).map((contributor) => ({
      name: contributor,
      contributions: totals[contributor]
    }));

    return this.setState({compiledContributors: contList})
  }

  getContributors = () => {
    const requests = []
    this.state.repoList.forEach((repo) => {
      requests.push( this.getFullList(`https://api.github.com/repos/${this.org}/${repo.name}/contributors`).then((repoContributors) => {
        return this.setState((state) => ({ repoContributors: {...state.repoContributors, [repo.name]: repoContributors}}));
      }));
    })
    return Promise.all(requests);
  }

  getFullList(baseLink){
    let returnList = [];
    const concatResponse = (response) => returnList = returnList.concat(response);

    let lastPage = 1;

    //send one request and get the total number of pages, then send the corresponding number of requests
    return this.callAPI(`${baseLink}?page=1&per_page=100`, false).then((res) =>{
      const links = parse(res.headers.get("Link"));
      lastPage = links ? links['last'].page : 1;

      return res.json()
    }).then(concatResponse).then(() => {
      const requests = [];
      let url = '';

      for(let page = 2; page <= lastPage; page += 1 ){
        url = `${baseLink}?page=${page}&per_page=100`
        requests.push(this.callAPI(url).then(concatResponse));
      }

      return Promise.all(requests).then(() => returnList);
    });

  }

  callAPI(url, parse = true){
    const request = fetch( url,
      {
        headers:{
          'Authorization': `token ${this.token}`,
        }
      }).then((res) =>{
        if(res.status >= 300 ){
          this.setState({showError: true});
        }
        return res;
      });

      return parse ? request.then(res => res.json()) : request;
  }

  compileRepos(){
    return this.state.repoList.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      contributors: this.state.repoContributors[repo.name] && this.state.repoContributors[repo.name].length
    }))
  }

  render() {
    return (
      <div>
        <Header submit={this.submit}/>
        <div className={this.state.showError ? 'error' : 'hidden'}>
            Something went wrong, please try again.
        </div>

        <div className='main'>
          <Tables repoList={this.compileRepos()} contributors={this.state.compiledContributors}/>
          <div className={this.state.loading ? 'loader' : 'hidden'}> </div>
        </div>
      </div>
    );
  }
}

export default GitLister;
