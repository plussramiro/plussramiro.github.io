---
layout: page
permalink: /repositories/
title: Repositories
description: Selected GitHub repositories and research code.
nav: true
nav_order: 4
---

<style>
  .repositories-cv .repositories-cv__octocat-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    background: var(--global-card-bg-color);
    transition: transform 0.14s ease;
  }

  .repositories-cv .repositories-cv__octocat-link:hover {
    transform: scale(1.04);
  }

  .repositories-cv .repositories-cv__octocat-link:active {
    transform: scale(1.08);
  }

  .repositories-cv .repositories-cv__octocat {
    width: 66px;
    height: 66px;
    object-fit: contain;
    display: block;
  }

  .repositories-cv .repositories-cv__repo-card .repo {
    max-width: 100%;
    padding: 0 !important;
    text-align: left;
  }

  .repositories-cv .repositories-cv__repo-card .repo img {
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
  }

  .repositories-cv .repositories-cv__repo-card .repo a {
    pointer-events: none;
    cursor: default;
  }

  @media (max-width: 767.98px) {
    .repositories-cv .repositories-cv__octocat-link {
      width: 74px;
      height: 74px;
    }

    .repositories-cv .repositories-cv__octocat {
      width: 50px;
      height: 50px;
    }
  }
</style>

{% if site.data.repositories.github_users %}
  <div class="cv repositories-cv">
    <div class="card mt-3 p-3">
      <h5 class="card-title mb-2">GitHub Profile</h5>
      <ul class="card-text font-weight-light list-group list-group-flush">
        {% for user in site.data.repositories.github_users %}
          <li class="list-group-item">
            <div class="row align-items-center">
              <div class="col-xs-2 col-sm-2 col-md-2 text-center date-column">
                <a
                  class="repositories-cv__octocat-link"
                  href="https://github.com/{{ user }}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile of {{ user }}"
                >
                  <img
                    class="repositories-cv__octocat"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub Octocat logo"
                    loading="lazy"
                  >
                </a>
              </div>
              <div class="col-xs-10 col-sm-10 col-md-10 mt-2 mt-md-0">
                <h6 class="title font-weight-bold ml-1 ml-md-4">
                  <a href="https://github.com/{{ user }}" target="_blank" rel="noopener noreferrer">@{{ user }}</a>
                </h6>
                <h6 class="ml-1 ml-md-4" style="font-size: 0.95rem">Main GitHub profile and research code repositories.</h6>
              </div>
            </div>
          </li>
        {% endfor %}
      </ul>
    </div>
  </div>
{% endif %}

{% if site.data.repositories.github_repos %}
  <div class="cv repositories-cv">
    <div class="card mt-3 p-3">
      <h5 class="card-title mb-2">Selected Repositories</h5>
      <ul class="card-text font-weight-light list-group list-group-flush">
        {% for repo in site.data.repositories.github_repos %}
          {% assign repo_name = repo | split: '/' | last %}
          {% assign repo_date = '' %}
          {% assign repo_comment = '' %}
          {% if repo_name == 'Wilson-Cowan-Hemispheric-Coupling' %}
            {% assign repo_date = 'Aug 2025 - Nov 2025' %}
            {% assign repo_comment = 'Repository to replicate the work called Hemispheric-Specific Coupling Improves Modeling of Functional Connectivity Using Wilson-Cowan Dynamics.' %}
          {% elsif repo_name == 'The-Role-of-Connection-Density-in-an-Adaptive-Network-with-Chaotic-Units' %}
            {% assign repo_date = 'Aug 2025 - Sep 2025' %}
            {% assign repo_comment = 'Repository to replicate the work called The Role of Connection Density in Adaptive Networks with Chaotic Units.' %}
          {% endif %}
          <li class="list-group-item">
            <div class="row">
              <div class="col-xs-2 col-sm-2 col-md-2 text-center date-column">
                <table class="table-cv">
                  <tbody>
                    <tr>
                      <td>
                        <span class="badge font-weight-bold danger-color-dark align-middle" style="min-width: 75px">{{ repo_date }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-xs-10 col-sm-10 col-md-10 mt-2 mt-md-0">
                <h6 class="title font-weight-bold ml-1 ml-md-4">
                  <a href="https://github.com/{{ repo }}" target="_blank" rel="noopener noreferrer">
                    {{ repo_name | replace: '-', ' ' }}
                  </a>
                </h6>
                {% if repo_comment != '' %}
                  <h6 class="ml-1 ml-md-4" style="font-size: 0.95rem">{{ repo_comment }}</h6>
                {% endif %}
                <div class="ml-1 ml-md-4 repositories-cv__repo-card">
                  {% include repository/repo.liquid repository=repo %}
                </div>
              </div>
            </div>
          </li>
        {% endfor %}
      </ul>
    </div>
  </div>
{% endif %}
